import { Injectable } from '@angular/core';
import { UserService, DataServiceExtendedWithReverseIndex } from 'src/app/providers/user/user.service';
import { database } from 'firebase/app';
import 'firebase/database';
import { OrganizedStacks } from 'src/app/model/product-organized';

@Injectable({
  providedIn: 'root'
})
export class StacksService extends DataServiceExtendedWithReverseIndex<OrganizedStacks> {
  static readonly dbPath = '/stacks';
  static readonly dbPathIndex = '/stacks_index';

  constructor(userService: UserService) {
    super(userService);
  }

  get pathDBName(): string {
    return StacksService.dbPath;
  }

  get pathDBIndex(): string {
    return StacksService.dbPathIndex;
  }

  /**
   * Basic new Stacks
   */
  createNew(): OrganizedStacks {
    return new OrganizedStacks(null, null);
  }

  // TODO
  getOrdersData(): void {}

  /**
   * Save the payments inside our database
   * @param uid
   * @param orderId
   * @param paymentData
   */
  async savePayments(uid, orderId, paymentData, total): Promise<string> {
    const paymentsRef = database()
      .ref('payments')
      .child(uid)
      .push();
    const newPaymentId = paymentsRef.key;
    await paymentsRef.set({
      paymentId: newPaymentId,
      orderId,
      paymentData,
      total
    });
    return newPaymentId;
  }

  /**
   * Save payment token in the database
   * @param uid
   * @param orderId
   * @param tokenData
   */
  async savePaymentToken(uid, orderId, tokenData, total): Promise<string> {
    const tokenRef = database()
      .ref('payments_token')
      .child(uid)
      .push();
    const newTokenId = tokenRef.key;
    await tokenRef.set({
      paymentId: newTokenId,
      orderId,
      tokenData,
      total
    });
    return newTokenId;
  }
}
