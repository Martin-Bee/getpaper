import { Injectable } from '@angular/core';
import { DataServiceExtended, UserService } from 'src/app/providers/user/user.service';
import { ShopInfo } from 'src/app/model/shopify/info';

@Injectable({
  providedIn: 'root'
})
export class ShopifyInfoStoreService extends DataServiceExtended<ShopInfo> {
  static readonly dbPath = '/shopify_stores';

  constructor(userService: UserService) {
    super(userService);
  }

  get pathDBName(): string {
    return ShopifyInfoStoreService.dbPath;
  }

  /**
   * Create new
   */
  createNew(): ShopInfo {
    return {};
  }
}
