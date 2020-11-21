import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/providers/user/user.service.js';
import { ToastController, NavController, PopoverController } from '@ionic/angular';
import * as text from 'src/app/resources/resource.json';

@Component({
  selector: 'app-account-menu-info',
  templateUrl: './account-menu-info.component.html',
  styleUrls: ['./account-menu-info.component.scss']
})
export class AccountMenuInfoComponent implements OnInit {
  public static userService: UserService;
  accountName: string;
  email: string;

  constructor(private toastCtrl: ToastController, private navCtrl: NavController, private popCtrl: PopoverController) {
    this.accountName = AccountMenuInfoComponent.userService.get('fullName');
    this.email = AccountMenuInfoComponent.userService.get('email');
  }

  ngOnInit(): void {}

  onClickEditProfile(): void {
    // TODO edit profile
  }

  updateInfos(): void {
    this.navigate('account-info');
  }
  updateSecurity(): void {
    this.navigate('account-security');
  }

  /**
   *
   * @param page the page to go
   */
  private navigate(page: string): void {
    this.popCtrl.dismiss();
    this.navCtrl.navigateForward(page);
  }

  /**
   * Logout click
   */
  async logOut(): Promise<void> {
    this.popCtrl.dismiss();
    await AccountMenuInfoComponent.userService.logOut();
    const toast = await this.toastCtrl.create({
      message: text.logout,
      duration: 2000,
      position: 'bottom'
    });
    this.navCtrl.navigateForward('');
    toast.present();
  }
}
