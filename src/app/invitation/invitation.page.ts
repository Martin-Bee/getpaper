import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Platform, MenuController, ModalController } from '@ionic/angular';
import { FormGroup } from '@angular/forms';
import { StacksService } from 'src/app/providers/stacks/stacks.service';
import { UserService } from 'src/app/providers/user/user.service';
import { OrganizedStacks } from 'src/app/model/product-organized';
import * as text from 'src/app/resources/resource.json';
import { SignupLoginCompletion } from 'src/app/account/signup-login/signup-login.component';
import { Delivery } from 'src/app/model/delivery.model';
import { OrderDetailsComponent } from './order-details/order-details.component';
import { Address } from 'src/app/model/address.model';
import { OrderOverview } from 'src/app/model/order-overview.model';
import { buildOrder } from 'src/app/model/order.model';
import { OrderService } from 'src/app/providers/order/order.service';

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.page.html',
  styleUrls: ['./invitation.page.scss']
})
export class InvitationPage implements OnInit {
  deliveryTimeForm: FormGroup;

  stack: OrganizedStacks;
  stackUserId: string;
  inviteeEmail: string;
  errorMessage: string;
  currentStep: number;
  overview: OrderOverview;
  shippingAddress: Address;
  showOverlay: boolean;
  search = '';

  constructor(
    private route: ActivatedRoute,
    private stacksService: StacksService,
    private userService: UserService,
    private orderService: OrderService,
    public menuController: MenuController,
    public plt: Platform,
    private modalController: ModalController
  ) {}

  /**
   * On Init()
   */
  ngOnInit(): void {
    this.initData();
  }

  /**
   * Init Data
   */
  async initData(): Promise<void> {
    // TODO handle the side menu
    await this.menuController.enable(false);
    // TODO add test if user already did it...
    this.showOverlay = true;
    this.currentStep = 1;

    const stacksId = this.route.snapshot.queryParamMap.get('id');
    this.inviteeEmail = this.route.snapshot.queryParamMap.get('email');
    this.stackUserId = await this.stacksService.getDataIndex(stacksId);
    if (this.stackUserId) {
      const stacks = await this.stacksService.getData(stacksId, this.stackUserId);
      if (!stacks) {
        this.displayError(text.link_stack_invalid);
        return;
      }
      this.stack = stacks[0];
      OrganizedStacks.afterDB(this.stack);
      OrganizedStacks.organizeToSell(this.stack);
      let showButton = true;

      // Preview Mode if no stripe or your own stack
      if (!this.stack.stripeAccessToken || !this.stack.stripeConnectKey) {
        this.errorMessage = text.stack_is_in_preview;
        showButton = false;
      }

      if (this.userService.hasUser && this.userService.get('uid') === this.stackUserId) {
        this.displayError(text.cant_buy_from_your_own);
        showButton = false;
      }
      this.overview = {
        stackName: '',
        totalSpend: 0,
        totalUnits: 0,
        rating: 0,
        currency: this.stack.currency,
        showOverlay: this.showOverlay,
        showButton,
        viewDetails: false
      };
    } else {
      this.displayError(text.link_stack_invalid);
    }
  }

  /**
   * Stack was not found
   */
  displayError(errorMessage: string): void {
    this.errorMessage = errorMessage;
  }

  /**
   * get the search query from the header
   * Automatically propagate the value change to the proper component
   * @param query
   */
  getSearchQuery(query: string): void {
    this.search = query;
  }

  /**
   * Display the order details when clicking on the button
   */
  async showViewDetails(): Promise<void> {
    const modal = await this.modalController.create({
      component: OrderDetailsComponent,
      componentProps: {
        overview: this.overview,
        stack: this.stack
      },
      showBackdrop: true
    });
    return await modal.present();
  }

  /**
   * Get the delivery information from the user
   * @param delivery
   */
  async getDelivery(delivery: Delivery): Promise<void> {
    // we have all the information saving them into the db
    if (this.userService.hasUser) {
      let order = buildOrder(this.overview, this.stack, this.shippingAddress, delivery);
      console.log(order);
      order = await this.orderService.save(order);
      console.log(order);
      // TODO check that the order ID is correct
      this.overview.orderId = order.id;
      this.goToNextStep();
    } else {
      this.errorMessage = text.you_need_to_be_logged_to_continue;
    }
  }

  /**
   * Get the overview
   * @param overview
   */
  getOverview(overview: OrderOverview): void {
    this.overview = overview;
    if (this.overview.totalUnits > 0) {
      if (this.errorMessage !== text.stack_is_in_preview) {
        this.errorMessage = undefined;
      }
    }
    this.showOverlay = overview.showOverlay;
  }

  /**
   * Go to shipping view
   */
  gotoShipping(): void {
    if (this.overview.totalUnits === 0) {
      this.errorMessage = text.need_at_least_one_product;
    } else {
      this.goToNextStep();
    }
  }

  /**
   * Get the shipping address from our component
   * @param address
   */
  getShippingAddress(address: Address): void {
    this.shippingAddress = address;
    this.goToNextStep();
  }

  /**
   * Go to the next step when login or account creation is successful
   * @param status
   */
  getLoginStatus(status: SignupLoginCompletion): void {
    // When status is created be carefull because it gets called twice!
    console.log(status);
    if (!this.userService.hasUser) {
      this.errorMessage = text.you_need_to_be_logged_to_continue;
      return;
    }

    if (this.userService.get('uid') === this.stackUserId) {
      this.errorMessage = text.cant_buy_from_your_own;
      return;
    }

    // Hard code the steps here
    this.errorMessage = undefined;
    this.currentStep = 3;
  }

  /**
   * Get Payment success
   * @param success
   */
  getPaymentSuccess(success: boolean): void {
    if (success) {
      this.goToNextStep();
    }
  }

  /**
   * Go to next step
   * @param step
   */
  goToNextStep(): void {
    if (!this.currentStep) {
      this.currentStep = 1;
    } else {
      this.currentStep += 1;
    }
    if (this.currentStep > 1) {
      this.overview.showButton = false;
      this.overview.viewDetails = true;
    }
  }
}
