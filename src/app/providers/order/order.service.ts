import { Injectable } from '@angular/core';
import { Order, buildOrder } from 'src/app/model/order.model';
import { DataServiceExtended, UserService } from 'src/app/providers/user/user.service';

@Injectable({
  providedIn: 'root'
})
export class OrderService extends DataServiceExtended<Order> {
  static readonly dbPath = '/orders';

  constructor(userService: UserService) {
    super(userService);
  }

  get pathDBName(): string {
    return OrderService.dbPath;
  }

  createNew(): Order {
    return buildOrder();
  }
}
