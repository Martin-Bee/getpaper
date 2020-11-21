import { Component, OnInit } from '@angular/core';
import { UserService, UserEvent } from 'src/app/providers/user/user.service';
import { SDialog } from 'src/app/utils/dialog-hack';
import * as text from 'src/app/resources/resource.json';
import { ShopifyConf } from 'src/app/model/shopify.model';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-brand-dashboard',
  templateUrl: './brand-dashboard.page.html',
  styleUrls: ['./brand-dashboard.page.scss']
})
export class BrandDashboardPage implements OnInit {
  showOverlay = true;
  currStep = 0;

  constructor(public userService: UserService, private navCtrl: NavController, private dialog: SDialog) {}

  /**
   * ngOnInit(0)
   */
  async ngOnInit(): Promise<void> {
    // When the user is logged in we receive a notification to display a welcome message
    this.userService.on(UserEvent.USER_LOGIN, async () => {
      await this.displayWelcomeMsg();
    });
    // try first time but maybe user is not loggin yet
    await this.displayWelcomeMsg();
  }

  /**
   * Display Welcome message
   */
  async displayWelcomeMsg(): Promise<void> {
    // Display first time welcome message
    if (this.userService.hasUser && this.userService.get('firstTime')) {
      this.showWelcomeMsg();
      await this.userService.save({ firstTime: false });
    } else {
    }
  }

  /**
   * Display Welcome Msg
   */
  async showWelcomeMsg(): Promise<void> {
    const name = text.welcome + this.userService.get('fullName');
    await this.dialog.createSuccessDialog(text.letsgo, name, text.welcome_msg);
  }

  /**
   * Next step
   */
  nextStep(): void {
    this.currStep++;
    if (this.currStep === 2) {
      this.showOverlay = false;
    }
  }

  /**
   * Get Shopify Store from the component
   * @param conf the returned Shopify Conf store
   */
  getShopifyStore(conf: ShopifyConf): void {
    if (conf) {
      this.showNewStoreAddAlert();
    } else {
      this.currStep = 0;
      this.showOverlay = true;
    }
  }

  /**
   * Show success meassage
   */
  async showNewStoreAddAlert(): Promise<void> {
    const header = text.congratulations + '!';
    await this.dialog.createSuccessDialog(text.letsgo, header, text.product_added, () => {
      this.navCtrl.navigateRoot('brand-stacks');
    });
  }
}
