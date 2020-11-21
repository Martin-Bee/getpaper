// tslint:disable: semicolon
export interface SEvents<X> {
  Data: X;
}
/**
 * T is a call back type function
 */
export class Eventing<X, T extends (args0: X) => void> {
  events: { [key: string]: T[] } = {};

  constructor(public data: SEvents<X>) {}

  /**
   * Add Listener
   * These functions are defined as arrow function because this must be bound to the actual class eventing
   * As these function are called outside of user this = user and then user.events = undefined
   * @param eventName the event
   * @param callback the function to execute
   */
  on = (eventName: string, callback: T): void => {
    if (!callback) {
      return;
    }

    const handlers = this.events[eventName] || [];
    handlers.push(callback);
    this.events[eventName] = handlers;
  };

  /**
   * Same as the on function, as to be defined as an arraw function
   * trigger an event
   * @param event the event
   */
  trigger = (event: string): void => {
    const handlers = this.events[event];
    if (!handlers || handlers.length === 0) {
      return;
    }
    handlers.forEach(callback => callback(this.data.Data));
  };
}
