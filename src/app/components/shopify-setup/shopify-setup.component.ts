import { Component, OnInit, Input, HostListener, EventEmitter, Output } from '@angular/core';
import { environment } from 'src/environments/environment';
import * as text from 'src/app/resources/resource.json';
import { ShopifyService } from 'src/app/providers/shopify/shopify.service';
import { ShopifyConf } from 'src/app/model/shopify.model';
import { WebNotification } from 'src/app/utils/notification-web';

enum APP_STATUS {
  START = 'start',
  OPEN = 'open',
  INSTALL_APP = 'install',
  TEST = 'test',
  FAIL = 'fail',
  END = 'end'
}

@Component({
  selector: 'shopify-setup',
  templateUrl: './shopify-setup.component.html',
  styleUrls: ['./shopify-setup.component.scss']
})
export class ShopifySetupComponent implements OnInit {
  @Input() asNew: boolean;
  @Output() setStore: EventEmitter<ShopifyConf> = new EventEmitter();
  // UI properties mapped by ngModel
  status = APP_STATUS.START;
  shopifyAddress: string;
  shopifyInstallUrl: string;
  errorMessage: string;
  notificationDisabled: string;
  wasAskedForPush: boolean = null;
  validAddress = false;
  data: ShopifyConf[];

  constructor(private shopifyService: ShopifyService, private notification: WebNotification) {}

  @HostListener('window:focus', ['$event'])
  async onFocus(): Promise<void> {
    // coming back
    if (this.status === APP_STATUS.INSTALL_APP) {
      const data = await this.shopifyService.getData(this.shopifyAddress);
      if (data && data[0] && data[0].token && data[0].token !== ShopifyService.tokenDefault) {
        this.success(data[0]);
      } else {
        this.status = APP_STATUS.TEST;
      }
    }
  }

  // TODO need to reinitialize variables like this.data or this.status??

  @HostListener('window:blur', ['$event'])
  onBlur(): void {
    if (this.status === APP_STATUS.OPEN) {
      this.status = APP_STATUS.INSTALL_APP;
    }
  }

  /**
   * Goes to next state
   */
  next(): void {
    if (!this.status) {
      this.status = APP_STATUS.START;
      return;
    }
    switch (this.status) {
      case APP_STATUS.START:
        this.status = APP_STATUS.OPEN;
        break;
      case APP_STATUS.OPEN:
        this.status = APP_STATUS.INSTALL_APP;
        break;
      case APP_STATUS.INSTALL_APP:
        this.status = APP_STATUS.TEST;
      case APP_STATUS.TEST: // valid test goes to end
        this.status = APP_STATUS.END;
      case APP_STATUS.FAIL:
        this.status = APP_STATUS.END;
        break;
      default:
        this.status = APP_STATUS.START;
        return;
    }
  }

  /**
   * Cancel
   */
  cancel(): void {
    this.invokeEvent(null);
  }

  async ngOnInit(): Promise<void> {
    this.errorMessage = null;
    // TODO reinitialize values when we display the component again without reloading the page
    // test it and see

    if (!this.shopifyService.hasUser) {
      return;
    }

    // Retrieving the first store
    const data = await this.shopifyService.getData();
    // Removing stores already properly configured
    if (data) {
      this.data = data.filter(elem => (elem.token && elem.token !== ShopifyService.tokenDefault ? false : true));
    }
    // We are not setting up a new store
    if (!this.asNew) {
      if (this.data && this.data[0]) {
        this.shopifyAddress = this.data[0].id;

        if (ShopifyService.isTokenDefined(data[0])) {
          console.log('Check if products were succesfully imported');
        }
      }

      this.addressChange();
    }

    // Requesting push permission
    // Display the layout 500ms after we ask for permission
    // if already got permission then the boolean will not be null be false
    setTimeout(() => {
      if (this.wasAskedForPush == null) {
        this.wasAskedForPush = true;
      }
    }, 500);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    this.notificationDisabled = await this.notification.requestPermission(payload => {
      this.success();
    });
    this.wasAskedForPush = false;
  }

  /**
   * Test Connection()
   */
  async testConnection(): Promise<void> {
    const data = await this.shopifyService.getData(this.shopifyAddress);
    if (data && ShopifyService.isTokenDefined(data[0])) {
      this.success();
    } else {
      this.status = APP_STATUS.FAIL;
    }
  }

  /**
   * Success method called when the addition was successful
   * @param conf the Shopify Conf created
   */
  private async success(conf?: ShopifyConf): Promise<void> {
    this.status = APP_STATUS.END;
    if (!conf) {
      const data = await this.shopifyService.getData(this.shopifyAddress);
      if (data && data[0]) {
        conf = data[0];
      }
    }

    this.invokeEvent(conf);
  }

  /**
   * Address is changing revalidating if the address if valid
   */
  addressChange(): void {
    this.status = APP_STATUS.START;

    if (!this.shopifyAddress) {
      this.validAddress = false;
      return;
    }
    this.shopifyAddress = this.shopifyAddress.toLowerCase();
    if (!/^[a-zA-Z0-9-]+$/.test(this.shopifyAddress)) {
      this.validAddress = false;
      return;
    }
    this.validAddress = true;
  }

  /**
   * invoke Event to end
   * @param conf the shopify conf
   */
  invokeEvent(conf: ShopifyConf): void {
    this.setStore.emit(conf);
  }

  /**
   * Valid Shopify Store
   */
  async validateStore(): Promise<boolean> {
    this.addressChange();
    if (!this.validAddress) {
      return false;
    }

    if (this.data) {
      // same store that the one saved in db
      for (const store of this.data) {
        if (store.id.toLowerCase() === this.shopifyAddress) {
          return true;
        }
      }
    }
    return !(await this.shopifyService.exists(this.shopifyAddress));
  }

  /**
   * Open app link
   */
  async openAppLink(): Promise<void> {
    if (!(await this.validateStore())) {
      this.errorMessage = text.invalid_store;
      return;
    }
    const fullStore = `${this.shopifyAddress}.myshopify.com`;

    // not the same store need to save it and delete the old one
    if (this.data && this.data[0] && this.shopifyAddress !== this.data[0].id) {
      await this.shopifyService.delete(this.data[0].id);
      this.data[0] = await this.shopifyService.save({ id: this.shopifyAddress, token: ShopifyService.tokenDefault });
    }

    if (!this.data || !this.data[0]) {
      // no data before it's ok brand new shopify store
      this.data = [];
      this.data[0] = await this.shopifyService.save({ id: this.shopifyAddress, token: ShopifyService.tokenDefault });
    }
    this.shopifyInstallUrl = `${environment.firebaseCloudFunctionsUrl}/shopify?shop=${fullStore}`;
    this.status = APP_STATUS.OPEN;
    window.open(this.shopifyInstallUrl, '_blank');
  }
}
