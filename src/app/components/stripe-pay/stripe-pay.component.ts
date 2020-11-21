import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { StacksService } from 'src/app/providers/stacks/stacks.service';
import { FireDataService } from 'src/app/providers/fire-data/fire-data.service';
import { OrderOverview } from 'src/app/model/order-overview.model';
import * as text from 'src/app/resources/resource.json';
import { UserService } from 'src/app/providers/user/user.service';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare let Stripe: any;

@Component({
  selector: 'stripe-pay',
  templateUrl: './stripe-pay.component.html',
  styleUrls: ['./stripe-pay.component.scss']
})
export class StripePayComponent implements OnInit {
  @Input() overview: OrderOverview;
  @Input() stripeConnectKey: string;
  @Input() stripeAccessToken: string;
  @Output() paymentSuccess: EventEmitter<boolean> = new EventEmitter();
  postalCode: string;
  errorMessage: string;

  stripe;
  cardNumberElement;
  cardExpiryElement;
  cardCvcElement;

  constructor(
    private stripeService: FireDataService,
    private loadingCtrl: LoadingController,
    private stacksService: StacksService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    if (!this.stripeAccessToken || !this.stripeConnectKey) {
      this.errorMessage = text.payment_stripe_inactive;
      (document.getElementById('payment-form') as HTMLInputElement).remove();
      return;
    }

    if (!this.userService.hasUser) {
      this.errorMessage = text.you_need_to_be_logged_to_continue;
      (document.getElementById('payment-form') as HTMLInputElement).remove();
      return;
    }

    if (Stripe) {
      this.stripe = Stripe(this.stripeConnectKey);
      this.createStripeChargeForm();
    }
  }

  /**
   * Create a new stripe charge
   */
  // TODO add server security to make sure the user didn't update the total to pay to a fake amount
  createStripeChargeForm(): void {
    const elements = this.stripe.elements();

    const style = {
      base: {
        iconColor: '#666EE8',
        color: '#31325F',
        lineHeight: '40px',
        fontWeight: 300,
        fontFamily: 'Helvetica Neue',
        fontSize: '15px',

        '::placeholder': {
          color: '#CFD7E0'
        }
      }
    };

    this.cardNumberElement = elements.create('cardNumber', {
      style
    });
    this.cardNumberElement.mount('#card-number-element');

    this.cardExpiryElement = elements.create('cardExpiry', {
      style
    });
    this.cardExpiryElement.mount('#card-expiry-element');

    this.cardCvcElement = elements.create('cardCvc', {
      style
    });
    this.cardCvcElement.mount('#card-cvc-element');

    document.querySelector('form').addEventListener('submit', async e => {
      e.preventDefault();
      this.submit();
    });
  }

  /**
   * Submit buttons
   */
  async submit(): Promise<void> {
    const total = Math.trunc(this.overview.totalSpend * 100);
    const postalCode = (document.getElementById('postal-code') as HTMLInputElement).value;
    if (!postalCode) {
      this.errorMessage = text.postal_code_required;
      return;
    }
    const options = {
      // eslint-disable-next-line @typescript-eslint/camelcase
      address_zip: (document.getElementById('postal-code') as HTMLInputElement).value
    };

    const loader = await this.loadingCtrl.create({
      spinner: 'circles'
    });

    await loader.present();

    try {
      const token = await this.stripe.createToken(this.cardNumberElement, options);
      if (token.error) {
        this.errorMessage = `${token.error.code} / ${token.error.message} `;
      } else {
        await this.stacksService.savePaymentToken(this.userService.get('uid'), this.overview.orderId, token, total);
        const charge = await this.stripeService.chargeStripe(
          token,
          total,
          'Example of charge (Martin)',
          this.stripeAccessToken,
          this.overview.currency
        );
        console.log('Charge Successfull! => ', charge);
        await this.stacksService.savePayments(this.userService.get('uid'), this.overview.orderId, charge, total);
        await this.stripeService.sendOrderConfirmationEmail(this.userService.get('email'), this.overview);
        console.log('Payment Data Stored Successfully!');
        this.paymentSuccess.emit(true);
      }
    } catch (err) {
      this.errorMessage = err;
      console.log(err);
    }
    loader.dismiss();
  }
}
