import { Component, OnInit } from '@angular/core';
import { UserService, UserEvent } from 'src/app/providers/user/user.service';
import { StacksUser, swithUserType } from 'src/app/model/user.model';
import { NavController, AlertController } from '@ionic/angular';
import { Address } from 'src/app/model/address.model';
import { deepEqual } from 'src/app/utils/deep-equal';
import * as text from 'src/app/resources/resource.json';
import { ShopifyService } from 'src/app/providers/shopify/shopify.service';
import { ShopifyConf } from 'src/app/model/shopify.model';

@Component({
  selector: 'app-account-info',
  templateUrl: './account-info.page.html',
  styleUrls: ['./account-info.page.scss']
})
export class AccountInfoPage implements OnInit {
  action = '';
  addressToUpdate: Address;
  newStore: boolean;
  public user: StacksUser = null;
  public stores: ShopifyConf[] = null;

  constructor(
    private shopifyService: ShopifyService,
    private userService: UserService,
    private navCtrl: NavController,
    private alertController: AlertController
  ) {
    this.userService.on(UserEvent.USER_INFO_AVAILABLE, async u => {
      this.user = u;
      this.initStores();
    });
    if (this.userService.hasUser) {
      this.user = userService.Data;
      this.initStores();
    }
  }

  ngOnInit(): void {}

  async initStores(): Promise<void> {
    this.stores = await this.shopifyService.getData();
  }

  /**
   * Add a new store
   */
  addStore(): void {
    this.action = 'add-store';
    this.newStore = true;
  }

  /**
   * Fix the setup of a store
   * @param item
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  finishSetupStore(item: ShopifyConf): void {
    this.action = 'add-store';
    this.newStore = false;
  }

  /**
   * Delete a store
   * @param item the store to delete
   */
  async deleteStore(item: ShopifyConf): Promise<void> {
    const alert = await this.alertController.create({
      header: `${text.delete_store_confirmation_header}`,
      message: `${text.delete_store_confirmation} <strong>${item.id}</strong>`,
      buttons: [
        {
          text: text.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (): void => {}
        },
        {
          text: text.ok,
          handler: (): void => {
            this.stores = this.stores.filter(elem => (elem.id === item.id ? false : true));
            this.shopifyService.delete(item.id);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   * Change email click Listener
   */
  changeEmail(): void {
    this.navCtrl.navigateForward('account-security');
  }

  /**
   * Address to update
   * @param address the address to update
   */
  changeAddress(address: Address): void {
    this.addressToUpdate = address;
    this.action = 'add-address';
  }

  /**
   * Add an address
   */
  addAddress(): void {
    this.addressToUpdate = null;
    this.action = 'add-address';
  }

  /**
   * Get Shopify Store
   * @param conf the conf
   */
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  getShopifyStore(conf: ShopifyConf) {
    if (!conf) {
      // Hide the widget cancel was hit
      this.action = '';
    } else {
      // Add the added store to the list
      this.stores.push(conf);
    }
  }

  /**
   * Delete an address
   * @param event the address
   */
  async deleteAddress(address: Address): Promise<void> {
    const alert = await this.alertController.create({
      header: `${text.delete_address_confirmation_header}`,
      message: `${text.delete_address_confirmation} <strong>${address.label}</strong> ${address.display}`,
      buttons: [
        {
          text: text.cancel,
          role: 'cancel',
          cssClass: 'secondary',
          handler: (): void => {}
        },
        {
          text: text.ok,
          handler: (): void => {
            this.deleteAddressFromUser(address);
          }
        }
      ]
    });

    await alert.present();
  }

  /**
   *
   * @param address the address to remove
   */
  deleteAddressFromUser(address: Address): void {
    if (!this.userService.hasUser || !this.user.addresses) {
      return;
    }
    this.userService.save({
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      addresses: this.userService.get('addresses').filter((value, index, arr) => !deepEqual(value, address))
    });
  }

  /**
   * Add an address
   * @param event the address
   */
  getAddress(event: Address): VoidFunction {
    if (!this.userService.hasUser || !event) {
      this.action = '';
      return;
    }
    // Update an addres
    let addresses = this.userService.get('addresses');
    if (this.addressToUpdate) {
      addresses = addresses.map(item => (deepEqual(item, this.addressToUpdate) ? event : item));
    } else {
      // Create a new address
      if (!addresses) {
        addresses = [];
      }
      addresses.push(event);
    }
    this.userService.save({ addresses });
    // change panel back to normal
    this.action = '';
  }

  /**
   * Switching the user type
   */
  switchType(): void {
    if (!this.userService.hasUser || !this.user.type) {
      return;
    }
    this.userService.save(swithUserType(this.user.type));
  }
}
