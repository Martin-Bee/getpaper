import { Component, NgZone } from '@angular/core';

import { Platform, MenuController, NavController, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { auth } from 'firebase/app';
import 'firebase/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService, UserEvent } from './providers/user/user.service';
import { StacksService } from './providers/stacks/stacks.service';
import { ShopifyService } from './providers/shopify/shopify.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  public sideMenuItems = [
    { title: 'Orders', url: '/signup', data: [] },
    { title: 'Products', url: '/signup', data: [] },
    { title: 'Stacks', url: '/signup', data: [] },
    { title: 'Stores', url: '/signup', data: [] }
  ];
  title = '';
  fullName = '';
  showOverlay = true;

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public userService: UserService,
    private stacksService: StacksService,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public zone: NgZone,
    public activatedRoute: ActivatedRoute,
    private menuController: MenuController,
    private shopifyService: ShopifyService,
    public router: Router
  ) {
    this.registerUserEvents();
    this.initFirebase();
    this.initializeApp();
  }

  /**
   * Initialize app
   */
  initializeApp(): void {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  /**
   * Hide and show left side menu
   */
  async splitPaneClick(): Promise<void> {
    const enable = await this.menuController.isEnabled();
    // We have to use enable instead of toggle or show() hide() because our menu is inside
    // a split panel. If not inside a split pane. All good we can use those methods
    await this.menuController.enable(!enable);
  }

  /**
   * Check if the route is an invitation route
   */
  private checkIfInvitation(): void {
    // loader.dismiss();
    this.zone.run(() => {
      // Invitation route has the user but not yet registered in DB
      console.log();
      if (this.router.url.includes('invitation') && this.activatedRoute.snapshot.queryParamMap.get('name')) {
        console.log('Coming Here: invitation');
      }
    });
  }

  private registerUserEvents(): void {
    // When the user is loggin out redirect the user to login page
    this.userService.on(UserEvent.USER_LOGOUT, () => {
      this.navCtrl.navigateRoot('login');
    });

    // Uncomment to have user Events
    // this.userService.on(UserEvent.USER_LOGIN, () => {});
    // this.userService.onCreated(() => {});
  }

  /**
   * Redirect user towards the proper page
   */
  private redirectUser(): void {
    // TODO implement if usertype is a buyer or a seller
    this.navCtrl.navigateRoot('brand-dashboard');
  }

  /**
   * If the user is logged in perform some basic action
   * @param user the logged in user
   */
  private async userIsLoggedIn(): Promise<void> {
    await this.userService.getUserAfterLogin();

    if (this.router.url.includes('login') || this.router.url.includes('signup')) {
      this.redirectUser();
    }

    if (this.userService.hasUserLoggedIn) {
      this.title = this.userService.get('companyName');
      this.fullName = this.userService.get('fullName');

      // Publis event for fetching userData
      // this.events.publish('fetched:userdata');
      // TOOO here is the loader we are dismissing
      // loader.dismiss();
      // Redirecting every route to dashboard page(not desired), let the request decide the route
      // If onboarding is complete, go to dashboard, check for redirect from stripe,
      /// it will have issues with dashboard route, handle it separately

      // When url has userId and stackId, it is coming from stripe
      if ((this.activatedRoute.snapshot.queryParamMap.get('userId'), this.activatedRoute.snapshot.queryParamMap.get('stackId'))) {
        // Url has both userId and stackId, dont do anything
        // Stripe redirect route
      } else if (this.activatedRoute.snapshot.queryParamMap.get('id') && this.activatedRoute.snapshot.queryParamMap.get('email')) {
        console.log('Coming Here');
        // invitation route
      } else {
        this.zone.run(() => {
          this.getMenuItemsDetails();
        });
      }

      // If user is invitee listen for orders
      // TODO here invitee will get the orders data if logged in
      // if (this.globals.userData.type === 'invitee') {
      //  this.fireData.getOrdersData();
      // }

      // if (this.router.url === '/login' || this.router.url === '/signup') {
      // We need to redirect
      // }
    }
  }

  /**
   * Intialize firebase
   */
  async initFirebase(): Promise<void> {
    auth().onAuthStateChanged(async user => {
      console.log('onAuthStateChanged USER => ', user);

      if (!user) {
        this.checkIfInvitation();
      } else {
        this.userIsLoggedIn();
      }
    });
  }

  /**
   * Get the menu details
   */
  async getMenuItemsDetails(): Promise<void> {
    if (this.userService.hasUserLoggedIn) {
      this.sideMenuItems.map(async item => {
        if (item.title === 'Stacks') {
          item.data = await this.stacksService.getData();
        }

        if (item.title === 'Stores') {
          item.data = await this.shopifyService.getData();
        }
      });
    }
  }

  /**
   * Goto function
   * @param where  the place
   * @param stackData  the stackData
   */
  goTo(where, stackData): void {
    switch (true) {
      case where === 'stacks':
        this.router.navigate(['brand-stacks', { stackId: stackData.stackId, hasOrderForm: true }]);
        // this.navCtrl.navigateRoot(['brand-stacks', { stackId: stackData.stackId, hasOrderForm: true }]);
        break;

      default:
        break;
    }
  }

  /*listenForEvents(): void {
    this.events.subscribe('signup:complete', () => {
      this.title = this.globals.User.companyName;
      this.fullName = this.globals.User.fullName;

      // Show Menu Overlay
      this.showOverlay = true;
    });

    this.events.subscribe('stripe:connected', () => {
      this.title = this.globals.User.companyName;
      this.fullName = this.globals.User.fullName;
    });

    this.events.subscribe('userdata:updated', () => {
      this.getMenuItemsDetails();

      if (this.globals.User && this.globals.User.type === 'invitee') {
        this.title = this.globals.User.companyName;
        this.fullName = this.globals.User.fullName;
      }
    });

    this.events.subscribe('orders:updated', () => {
      if (this.globals) {
        map(this.sideMenuItems, item => {
          if (item.title === 'Orders') {
            item.data = this.globals.ordersData ? toArray(this.globals.ordersData) : [];
            console.log('orders => ', item);
          }
        });
      }
    });
  }*/
}
