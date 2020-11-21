import { database } from 'firebase/app';
import 'firebase/database';
import { Eventing, SEvents } from 'src/app/utils/eventing';

export enum SEvent {
  ATTR_UPDATED = 'attr_updated',
  UPDATED = 'updated',
  CREATED = 'created'
}

type SCallback<T> = (arg: T) => void;

/**
 * Work in progress for this Class
 * Stacks Data emcapsulation
 */
export class SData<T> {
  private data: T;

  constructor(data: T) {
    this.data = data;
  }

  /**
   * Accessor on data
   */
  get Data(): T {
    return this.data;
  }

  /**
   *
   * @param propName the property name
   */
  get<X extends keyof T>(propName: X, noException?: boolean): T[X] {
    if (!this.data) {
      if (noException) {
        return null;
      } else {
        throw new Error('No data - DataService Exception');
      }
    }
    return this.data[propName];
  }

  /**
   * Update any properties
   * @param update the user to update
   */
  set(update: T): void {
    Object.assign(this.data, update);
  }
}

/**
 * Or interface that have an id
 */
export interface SID {
  id?: string;
  uid?: string;
}

export abstract class DataService<T extends SID> implements SEvents<T> {
  eventing = new Eventing<T, SCallback<T>>(this);
  protected data: SData<T>;

  on = this.eventing.on;
  trigger = this.eventing.trigger;

  constructor() {
    this.data = new SData(this.createNew());
  }

  abstract get pathDBName(): string;

  /**
   * Return the current user
   */
  get Data(): T {
    return this.data.Data;
  }

  /**
   * Create New
   */
  abstract createNew(): T;

  /**
   * Get
   * @param propName propName
   * @param noException  exception?
   */
  get<X extends keyof T>(propName: X, noException?: boolean): T[X] {
    return this.data.get(propName, noException);
  }

  /**
   * On object updated
   * @param callback the callback
   */
  onUpdate(callback: SCallback<T>): void {
    return this.on(`${this.pathDBName}-${SEvent.UPDATED}`, callback);
  }

  /**
   * On object created
   * @param callback the callback
   */
  onCreated(callback: SCallback<T>): void {
    return this.on(`${this.pathDBName}-${SEvent.CREATED}`, callback);
  }

  /**
   * Update any properties
   * @param update the user to update
   */
  set(update: T): void {
    // no data to update object is null create a new instance
    if (!this.data || !this.data.Data) {
      this.reset();
    }
    this.data.set(update);
    // const type = typeof update;
    this.trigger(`${this.pathDBName}-${SEvent.ATTR_UPDATED}`);
  }

  /**
   * Get the Data that is currently logged in if only one
   * In case of multiple data it doesn't get reassign and just return an array
   * @param the data the get for that specifi uId
   */
  async getData(id: string, extraPath?: string): Promise<T[]> {
    const path = extraPath ? `${this.pathDBName}/${extraPath}` : this.pathDBName;
    let userRef = database().ref(path);
    if (id) {
      userRef = userRef.child(id);
    }
    const tmp = await userRef.once('value');
    const data = tmp.val();
    const array: T[] = [];

    if (data) {
      if (data.hasOwnProperty('id') || data.hasOwnProperty('uid')) {
        this.data = new SData<T>(data);
        array.push(data);
        return array;
      }
      for (const key in data) {
        if (key) {
          array.push(data[key]);
        }
      }
    }
    return array;
  }

  /**
   * Reset the data
   */
  reset(): void {
    this.data = new SData(this.createNew());
  }

  /**
   * Delete a specific element
   * @param data the data
   */
  async delete(id: string, extraPath?: string): Promise<void> {
    const path = extraPath ? `${this.pathDBName}/${extraPath}` : this.pathDBName;
    const userRef = database()
      .ref(path)
      .child(id);
    await userRef.remove();
  }

  /**
   * id exists somewhere
   * @param id the id to check
   */
  exists(id: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      try {
        const ref = database().ref(this.pathDBName);
        ref.equalTo(id).once('value', snapshot => {
          if (snapshot.exists()) {
            return resolve(true);
          } else {
            return resolve(false);
          }
        });
      } catch (err) {
        return resolve(true);
      }
      return reject(false);
    });
  }

  /**
   * Save or update the data
   * @param data the data to save
   */
  async save(data?: T, extraPath?: string): Promise<T> {
    const path = extraPath ? `${this.pathDBName}/${extraPath}` : this.pathDBName;

    if (data) {
      // update the data in instance
      this.set(data);
    }
    // define the id
    const id = this.data.get('id') || this.data.get('uid');
    let dbRef = database().ref(path);
    if (!id) {
      // generate a new id
      const newData = dbRef.push();
      await newData.set(this.data.Data);
      const key = { id: newData.key } as T;
      this.set(key);
      this.trigger(`${this.pathDBName}-${SEvent.CREATED}`);
    } else {
      dbRef = dbRef.child(id);
      const snap = await dbRef.once('value');
      if (snap.exists()) {
        dbRef.update(this.data.Data);
        this.trigger(`${this.pathDBName}-${SEvent.UPDATED}`);
      } else {
        dbRef.update(this.data.Data);
        this.trigger(`${this.pathDBName}-${SEvent.CREATED}`);
      }
    }
    return this.Data;
  }
}
