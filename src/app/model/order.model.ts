import { OrderOverview } from 'src/app/model/order-overview.model';
import { OrganizedStacks } from './product-organized';
import { Delivery } from './delivery.model';
import { Address } from './address.model';

export interface Order {
  // Listing properties for various operation on users
  id?: string;
  stackId: string;
  totalUnits: number;
  totalSpend: number;
  currency: string;
  quantitysDB: {};
  addressShipping: Address;
  delivery: Delivery;
}

function escapeKey(key): string {
  return key.replace('/', '\\');
}

/**
 * Build an order from a list of various component
 * @param overview
 * @param stack
 * @param addressShipping
 * @param delivery
 */
export function buildOrder(overview?: OrderOverview, stack?: OrganizedStacks, addressShipping?: Address, delivery?: Delivery): Order {
  let quantitysDB;
  if (overview && overview.quantitys) {
    quantitysDB = [...overview.quantitys.entries()].reduce((obj, [key, value]) => ((obj[escapeKey(key)] = value), obj), {});
  }
  return {
    stackId: stack?.id,
    totalUnits: overview?.totalUnits,
    totalSpend: overview?.totalSpend,
    currency: stack?.currency,
    quantitysDB,
    addressShipping,
    delivery
  };
}
