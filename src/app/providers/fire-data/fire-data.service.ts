import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Products } from 'src/app/model/shopify/products.model';
import { StripeConnectResponse } from 'src/app/model/stripe-connect-response';
import { OrderOverview } from 'src/app/model/order-overview.model';

export interface ShopifyStore {
  shopifyAccessToken: string;
  shopifyAddress: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type R = Record<string, any>;

@Injectable({
  providedIn: 'root'
})
export class FireDataService {
  static readonly sendVerificationCode = '/sendVerificationCode';
  static readonly sendWelcomeEmail = '/sendWelcomeEmail';
  static readonly sendOrderConfirmationEmail = '/sendOrderConfirmationEmail';
  static readonly sendInvitation = '/sendInvitation';
  static readonly getShopifyProducts = '/getShopifyProducts';
  static readonly getShopifyStoreInfo = '/getShopifyStoreInfo';
  static readonly stripeConnect = '/stripeConnect';
  static readonly chargeStripe = '/stripeCharge';
  static readonly testShopifyProduct = '/testShopifyProduct';
  static readonly testNotification = '/testNotification';

  constructor(public http: HttpClient) {}

  /**
   * Retrieve store information
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getShopifyStoreInfo(store: ShopifyStore): Observable<any> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return this.shopifyHelper<any>(store, FireDataService.getShopifyStoreInfo);
  }

  /**
   * Retrieve a list of product from our shop
   * @param store the store infor
   */
  getShopifyProduct(store: ShopifyStore): Observable<Products> {
    return this.shopifyHelper<Products>(store, FireDataService.getShopifyProducts);
  }

  /**
   * Helper to query shopify firefunction
   * @param store the store
   * @param uri frag to retrieve
   */
  shopifyHelper<T>(store: ShopifyStore, uri: string): Observable<T> {
    const url = environment.firebaseCloudFunctionsUrl + uri;
    const body = {
      token: store.shopifyAccessToken,
      shop: store.shopifyAddress
    };
    return this.http.post<T>(url, body);
  }

  /**
   * Send Order confirmation Email()
   * @param email
   * @param overview
   */
  sendOrderConfirmationEmail(email: string, overview: OrderOverview): Promise<R> {
    const url = environment.firebaseCloudFunctionsUrl + FireDataService.sendOrderConfirmationEmail;
    const body = { email, overview };
    return this.http.post(url, body).toPromise();
  }

  /**
   * Send wecome email
   * @param user the User to send the email to
   */
  async sendWelcomeEmail(email: string): Promise<R> {
    const url = environment.firebaseCloudFunctionsUrl + FireDataService.sendWelcomeEmail;
    const body = { email };
    return this.http.post(url, body).toPromise();
  }

  async testNotification(): Promise<R> {
    console.log('Test notification firedata');
    const url = environment.firebaseCloudFunctionsUrl + FireDataService.testNotification;
    return this.http.post(url, '').toPromise();
  }

  async testShopifyProducts(): Promise<R> {
    console.log('Test shopify firedata');
    const url = environment.firebaseCloudFunctionsUrl + FireDataService.testShopifyProduct;
    return this.http.post(url, '').toPromise();
  }

  async connectStripe(data: string): Promise<StripeConnectResponse> {
    return new Promise(async resolve => {
      console.log('Test connect stripe');
      const url = environment.firebaseCloudFunctionsUrl + FireDataService.stripeConnect;
      await this.http.post(url, data).subscribe(data => {
        resolve(data as StripeConnectResponse);
      });
    });
  }

  /**
   * Send invite
   * @param collectionName the collection name
   * @param receivers the receivers
   * @param companyName the company Name
   * @param stackName newStackFormKey or orderId
   */
  async sendInvites(stackName: string, receivers: string[], companyName: string): Promise<R> {
    const url = environment.firebaseCloudFunctionsUrl + FireDataService.sendInvitation;
    const body = {
      receivers,
      companyName,
      stackName
    };
    return this.http.post(url, body).toPromise();
  }

  /**
   * charge a card with Stripe
   * @param token
   * @param amount
   * @param description
   * @param accessToken
   */
  async chargeStripe(token, amount, description, accessToken, currency): Promise<R> {
    const url = environment.firebaseCloudFunctionsUrl + FireDataService.chargeStripe;
    const body = {
      amount,
      token,
      description,
      accessToken,
      currency
    };
    return this.http.post(url, body).toPromise();
  }
}
