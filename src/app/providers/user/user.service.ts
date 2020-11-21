import { Injectable } from '@angular/core';
import { StacksUser } from 'src/app/model/user.model';
import { auth, database } from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import { FireDataService } from 'src/app/providers/fire-data/fire-data.service';
import { Storage } from '@ionic/storage';
import { DataService, SEvent, SData, SID } from 'src/app/utils/data-service';

export enum UserEvent {
  USER_LOGOUT = 'user-logout',
  USER_LOGIN = 'user-login',
  USER_INFO_AVAILABLE = 'user-info'
}

@Injectable({
  providedIn: 'root'
})
export class UserService extends DataService<StacksUser> {
  static readonly dbUsers = '/stacks_users';
  static readonly keyStorage = 'islogged';

  private isLogged: boolean | null = null;

  constructor(private fireData: FireDataService, private storage: Storage) {
    super();
  }

  get pathDBName(): string {
    return UserService.dbUsers;
  }

  get hasUser(): boolean {
    return this.get('email') ? true : false;
  }

  /**
   * Create a new default User
   */
  createNew(): StacksUser {
    return {
      email: '',
      subscribeToService: false,
      firstTime: true
    };
  }

  /**
   * Setting up empty password
   */
  setEmptyPassword(): void {
    this.set({ password: null });
  }

  /**
   * Has the user logged in yet?
   */
  get hasUserLoggedIn(): boolean {
    if (!this.isLogged) {
      return false;
    } else {
      return this.isLogged;
    }
  }

  /**
   * Return the storage key
   * @returns if the user was logged in or not
   */
  async mightBeLoggedIn(): Promise<boolean> {
    if (this.isLogged == null) {
      return (await this.storage.get(UserService.keyStorage)) as boolean;
    } else {
      return this.isLogged;
    }
  }

  /**
   * Log out our user
   */
  async logOut(): Promise<void> {
    this.isLogged = false;
    this.reset();
    await this.storage.set(UserService.keyStorage, false);
    await auth().signOut();
    this.trigger(UserEvent.USER_LOGOUT);
  }

  /**
   * Check if email exists in the database
   * Error code could be = to 'auth/invalid-email'
   * @param email the email address
   */
  async checkIfEmailExists(email: string): Promise<boolean> {
    const data = await auth().fetchSignInMethodsForEmail(email);
    if (data.length > 0) {
      return true;
    }
    return false;
  }

  /**
   * Set User as if he is logged In
   */
  async setHasLoggedIn(): Promise<void> {
    this.isLogged = true;
    await this.storage.set(UserService.keyStorage, true);
  }

  /**
   * Get the user after automatic login
   */
  async getUserAfterLogin(): Promise<StacksUser> {
    const uid = auth().currentUser.uid;
    // To simulate another user
    // const uid = 'vWsFZiLDuTWC7uM3XYZtSB31iGJ2';
    // const uid = '8Q16IBhaohPRQIehmc84yVxc7UR2';
    const user = await this.getData(uid);
    this.data = new SData(user[0]);
    this.setHasLoggedIn();
    this.trigger(UserEvent.USER_INFO_AVAILABLE);
    return user[0];
  }

  /**
   * Register a user
   * @param user the user to register
   */
  async registerUser(): Promise<void> {
    const newUser = await auth().createUserWithEmailAndPassword(this.get('email'), this.get('password'));
    this.setEmptyPassword();
    // merge the data with the uid
    const promiseCreated = this.save({ uid: newUser.user.uid });
    const promiseSendWelcome = this.fireData.sendWelcomeEmail(this.get('email'));
    const promiseSendVerification = newUser.user.sendEmailVerification();
    // const [update, sendWelcome, sendVerification] =
    await Promise.all([promiseCreated, promiseSendWelcome, promiseSendVerification]);
    this.eventing.trigger(`${UserService.dbUsers}-${SEvent.CREATED}`);
  }

  /**
   * Update the user email and sends him an email notification
   * @param userToUpdate the user to update
   */
  async updateEmail(email: string): Promise<void> {
    const user = auth().currentUser;
    await user.updateEmail(email);
    await user.sendEmailVerification();
    await this.save({ email });
  }

  /**
   * Reauthenticate the user with current password
   * @param currentPassword the password
   */
  async reauthenticate(currentPassword): Promise<auth.UserCredential> {
    const user = auth().currentUser;
    const cred = auth.EmailAuthProvider.credential(user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }

  /**
   * Update Password for the user
   * @param user: the user
   */
  async updatePassword(password: string): Promise<void> {
    const userFirebase = auth().currentUser;
    await userFirebase.updatePassword(password);
    // this.trigger(UserEvent.USER_UPDATED);
    this.setEmptyPassword();
  }

  /**
   * Login a user from a loginForm object with firebase service
   */
  async login(user: StacksUser, errorCallback: () => void): Promise<boolean> {
    try {
      await auth().signInWithEmailAndPassword(user.email, user.password);
      this.trigger(UserEvent.USER_LOGIN);
      return true;
      // Do nothing here the App firebase listener is going to detecht that the user is now logged in
    } catch (err) {
      console.log('err login => ', err);
      // code: "auth/user-not-found", message: "There is no user record corresponding to this identifier.
      // The user may have been deleted."}
      errorCallback();
      return false;
    }
  }

  /**
   * Reset Password function
   */
  async resetPassword(email: string): Promise<boolean> {
    try {
      await auth().sendPasswordResetEmail(email);
      return true;
    } catch (err) {
      return false;
    }
  }
}

/**
 * Extended data Service that have userService auto injected in it.
 */
export abstract class DataServiceExtended<T> extends DataService<T> {
  protected userService: UserService;

  constructor(userService: UserService) {
    super();
    this.userService = userService;
  }

  get hasUser(): boolean {
    return this.userService.hasUser;
  }

  /**
   * Override of save
   * @param data the data to save
   */
  save(data?: T): Promise<T> {
    return super.save(data, this.userService.get('uid'));
  }

  /**
   * Overrid of the getData to had the uid of the user
   * @param id the id
   */
  getData(id?: string, uid?: string): Promise<T[]> {
    return super.getData(id, uid ? uid : this.userService.get('uid'));
  }
}

/**
 * With Reverse Index when saving
 */
export abstract class DataServiceExtendedWithReverseIndex<T extends SID> extends DataServiceExtended<T> {
  abstract get pathDBIndex(): string;

  /**
   * Overrides this method to set a special key for the index
   */
  getKeyForIndex(): string {
    return this.userService.get('uid');
  }

  /**
   * Rename key and update
   * @param data
   * @param previousId
   */
  async renameAndUpdate(data: T, previousId: string): Promise<T> {
    this.delete(previousId);
    return this.save(data);
  }
  /**
   * Overriding
   * @param data the data to save
   */
  async save(data?: T): Promise<T> {
    this.saveIndex(data);
    return super.save(data);
  }

  /**
   * Delete a specific element
   * @param data the data
   */
  async delete(id: string): Promise<void> {
    this.deleteIndex(id);
    await super.delete(id);
  }

  /**
   * Save index
   * @param data
   * @param value
   */
  private async saveIndex(data?: T): Promise<void> {
    if (data && data.id) {
      const dbRef = database()
        .ref(this.pathDBIndex)
        .child(data.id);
      // do not need to update can always set the samve value
      await dbRef.set(this.getKeyForIndex());
    }
  }

  /**
   * GetDataIndex
   * @param id the id
   */
  async getDataIndex(id: string): Promise<string | undefined> {
    if (id) {
      try {
        const ref = database()
          .ref(this.pathDBIndex)
          .child(id);
        const snap = await ref.once('value');
        if (snap.exists()) {
          return snap.val();
        } else {
          return undefined;
        }
      } catch (err) {
        return undefined;
      }
    }
  }

  /**
   * Exists
   * @param id the store id
   */
  async exists(id: string): Promise<boolean> {
    if (id) {
      try {
        const ref = database()
          .ref(this.pathDBIndex)
          .child(id);
        const snap = await ref.once('value');
        if (snap.exists()) {
          return true;
        } else {
          return false;
        }
      } catch (err) {
        return false;
      }
    }
  }

  /**
   * Delete the index
   * @param id index to delete
   */
  private async deleteIndex(id: string): Promise<void> {
    const userRef = database()
      .ref(this.pathDBIndex)
      .child(id);
    try {
      await userRef.remove();
    } catch (err) {}
  }
}
