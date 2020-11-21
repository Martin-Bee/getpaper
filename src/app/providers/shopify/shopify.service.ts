import { Injectable } from '@angular/core';
import { ShopifyConf } from 'src/app/model/shopify.model';
import { UserService, DataServiceExtendedWithReverseIndex } from 'src/app/providers/user/user.service';
import { ShopifyProductsService } from 'src/app/providers/products/products.service';
import { Products } from 'src/app/model/shopify/products.model';
import { ShopInfo } from 'src/app/model/shopify/info';
import { ShopifyInfoStoreService } from 'src/app/providers/shopinfo/shopinfo.service';

@Injectable({
  providedIn: 'root'
})
export class ShopifyService extends DataServiceExtendedWithReverseIndex<ShopifyConf> {
  static readonly dbPath = '/shopify_conf';
  static readonly dbPathIndex = '/shopify_conf_index';
  static readonly tokenDefault = 'not_set';
  static readonly storeDefault = 'default';

  constructor(
    userService: UserService,
    private shopifyProductService: ShopifyProductsService,
    private shopifyInfoService: ShopifyInfoStoreService
  ) {
    super(userService);
  }

  get pathDBName(): string {
    return ShopifyService.dbPath;
  }

  get pathDBIndex(): string {
    return ShopifyService.dbPathIndex;
  }

  /**
   * Do we have a token defined
   * @param conf the shopify conf
   */
  static isTokenDefined(conf: ShopifyConf): boolean {
    if (!conf) {
      return false;
    }
    if (conf.token) {
      if (conf.token !== ShopifyService.tokenDefault) {
        return true;
      }
    }
  }

  /**
   * Create new
   */
  createNew(): ShopifyConf {
    return {
      id: ShopifyService.storeDefault,
      token: ShopifyService.tokenDefault
    };
  }

  /**
   * Get some info about stores
   */
  async getStoreInfos(): Promise<ShopInfo[]> {
    const stores = await this.getData();
    const shops: ShopInfo[] = [];
    for (const store of stores) {
      const shop = await this.shopifyInfoService.getData(store.id);
      shops.push(...shop);
    }

    return shops;
  }

  /**
   * Get Shopify Products
   */
  async getShopifyProducts(): Promise<[Products, string[], string[]]> {
    const stores = await this.getData();
    const products: Products = { products: [] };
    const storeNotSetup = [];
    const storeLoading = [];
    for (const store of stores) {
      if (store.status === 'done') {
        const ps: Products[] = await this.shopifyProductService.getData(store.id);
        for (const key in ps[0]) {
          if (key) {
            products.products.push(ps[0][key]);
          }
        }
      } else if (store.status === 'loading') {
        storeLoading.push(store.id);
      } else {
        storeNotSetup.push(store.id);
      }
    }
    return [products, storeLoading, storeNotSetup];
  }
}
