import { Address } from './address.model';
import { StripeConnectInfo } from './stripe-connect-response';

export enum UserType {
  BUYER = 'buyer',
  SELLER = 'seller',
  BOTH = 'both',
  UNDEFINED = 'undefined'
}

/**
 * Switch the userType to the opposite
 * @param currentType the current type of the user
 */
export function swithUserType(currentType: UserType): { type: UserType } {
  switch (currentType) {
    case UserType.BUYER:
      return { type: UserType.SELLER };

    case UserType.SELLER:
      return { type: UserType.BUYER };

    case UserType.UNDEFINED:
      return { type: UserType.UNDEFINED };

    case UserType.BOTH:
      return { type: UserType.BOTH };

    default:
      return { type: UserType.UNDEFINED };
  }
}

/**
 * Our Stacks User Properties
 */
export interface StacksUser {
  // Listing properties for various operation on users
  uid?: string;
  email?: string;
  password?: string;
  additionalFields?: string[];
  type?: UserType;
  firstTime?: boolean;
  fullName?: string;
  addresses?: Address[];
  subscribeToService?: boolean;
  companyName?: string;
  // userName: string;
  additionalUserData?: string;
  url?: string;
  slug?: string;
  stripeConnect?: StripeConnectInfo;
}
