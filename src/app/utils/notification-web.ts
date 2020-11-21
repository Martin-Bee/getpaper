import { messaging, database } from 'firebase/app';
import 'firebase/messaging';
import 'firebase/database';
import { Injectable } from '@angular/core';
import { UserService } from 'src/app/providers/user/user.service';
import { FireDataService } from 'src/app/providers/fire-data/fire-data.service';

@Injectable({
  providedIn: 'root'
})
export class WebNotification {
  static readonly notificationPath = 'notification_users';
  constructor(private userService: UserService, private fireData: FireDataService) {}

  // Saves the token to the database if available. If not request permissions.
  private async saveToken(): Promise<string> {
    const currentToken = await messaging().getToken();
    if (currentToken) {
      database()
        .ref(`${WebNotification.notificationPath}/${this.userService.get('uid')}/notificationTokens/${currentToken}`)
        .set(true);
      return currentToken;
    }
  }

  /**
   * Requests permission to send notifications on this browser.
   * @param callback the function
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async requestPermission(callback: (payload: any) => void): Promise<string> {
    try {
      await Notification.requestPermission();
      // Register our method
      messaging().onMessage(payload => {
        this.onMessage(payload);
        callback(payload);
      });
      // Try to save the token
      try {
        await this.saveToken();
        return null;
      } catch (err) {
        if (err.code === 'messaging/permission-default') {
          return 'You have not enabled notifications on this browser. To enable notifications reload the page and allow notifications using the permission dialog.';
        } else if (err.code === 'messaging/notifications-blocked') {
          return 'You have blocked notifications on this browser. To enable notifications follow these instructions: <a href="https://support.google.com/chrome/answer/114662?visit_id=1-636150657126357237-2267048771&rd=1&co=GENIE.Platform%3DAndroid&oco=1">Android Chrome Instructions</a><br/><a href="https://support.google.com/chrome/answer/6148059">Desktop Chrome Instructions</a>';
        }
      }

      return null;
    } catch (err) {
      return 'Unable to get permission to notify.';
    }
  }

  /**
   * onMessage()
   * @param payload the payload received by the server
   */
  onMessage(payload): void {
    console.log('Notifications received.', payload);

    // Normally our Function sends a notification payload, we check just in case.
    if (payload.notification) {
      // If notifications are supported on this browser we display one.
      // Note: This is for demo purposes only. For a good user experience it is not recommended to display browser
      // notifications while the app is in focus. In a production app you probably want to only display some form of
      // in-app notifications like the snackbar (see below).
      if (Notification instanceof Function) {
        // This displays a notification if notifications have been granted.
        // tslint:disable-next-line: no-unused-expression
        new Notification(payload.notification.title, payload.notification);
      }
    }
  }
}
