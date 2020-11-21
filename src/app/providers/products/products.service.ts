import { Injectable } from '@angular/core';
import { DataServiceExtended, UserService } from 'src/app/providers/user/user.service';
import { Products } from 'src/app/model/shopify/products.model';

@Injectable({
  providedIn: 'root'
})
export class ShopifyProductsService extends DataServiceExtended<Products> {
  static readonly dbPath = '/shopify_products';

  constructor(userService: UserService) {
    super(userService);
  }

  get pathDBName(): string {
    return ShopifyProductsService.dbPath;
  }

  /**
   * Create new
   */
  createNew(): Products {
    return { products: [] };
  }
}
