export enum OptionTimeDelivery {
  IMMEDIATE = 'immediate',
  CERTAINDAY = 'certainDay',
  LEASTEXPENSIVE = 'leastExpensive',
  ENOUGH75 = 'enough75'
}

/**
 * Delivery option
 */
export interface Delivery {
  when: OptionTimeDelivery;
  setDefault: boolean;
  date: string;
}
