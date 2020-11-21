import { Component, OnInit } from '@angular/core';
import { StacksUser } from 'src/app/model/user.model';
import { UserEvent, UserService } from 'src/app/providers/user/user.service';
import { ToastController } from '@ionic/angular';
import * as text from 'src/app/resources/resource.json';

@Component({
  selector: 'app-account-security',
  templateUrl: './account-security.page.html',
  styleUrls: ['./account-security.page.scss']
})
export class AccountSecurityPage implements OnInit {
  public user: StacksUser = null;
  display = '';
  newEmail = '';
  newPassword = '';
  confirmPassword = '';
  password = '';
  hasError = false;

  constructor(private userService: UserService, private toastCtrl: ToastController) {
    this.userService.on(UserEvent.USER_INFO_AVAILABLE, u => (this.user = u));
    if (this.userService.hasUser) {
      this.user = userService.Data;
    }
  }

  /**
   * Click on update Email
   */
  updateEmail(): void {
    this.hasError = false;
    this.display = 'update-email';
  }

  cancel(): void {
    this.display = '';
  }

  /**
   * Update the new email
   */
  async updateNewEmail(): Promise<void> {
    if (!this.newEmail || !this.isEmail() || !this.password) {
      this.hasError = true;
      return;
    }
    try {
      await this.userService.reauthenticate(this.password);
      await this.userService.updateEmail(this.newEmail);
      this.display = '';
      this.displaySuccessUpdate(text.email_updated);
    } catch (err) {
      this.hasError = true;
    }
  }

  async updateNewPassword(): Promise<void> {
    if (
      !this.newPassword ||
      !this.confirmPassword ||
      !this.password ||
      this.newPassword !== this.confirmPassword ||
      this.newPassword.length < 6
    ) {
      this.hasError = true;
      return;
    }
    try {
      await this.userService.reauthenticate(this.password);
      await this.userService.updatePassword(this.newPassword);
      this.display = '';
      this.displaySuccessUpdate(text.password_updated);
    } catch (err) {
      this.hasError = true;
    }
  }

  /**
   * Dispaly succressfull Toast
   */
  private async displaySuccessUpdate(message: string): Promise<void> {
    const toast = await this.toastCtrl.create({
      message,
      duration: 4000,
      position: 'bottom'
    });
    toast.onDidDismiss().then(() => {
      // just wait for the firebase auth service to log the user
    });
    toast.present();
  }

  isEmail(): boolean {
    const regexp = new RegExp(
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
    return regexp.test(this.newEmail);
  }

  /**
   * Click on update Password
   */
  updatePassword(): void {
    this.hasError = false;
    this.display = 'update-password';
  }

  ngOnInit(): void {}
}
