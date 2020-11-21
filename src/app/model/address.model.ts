/**
 * Represent an address
 */
export interface Address {
  address: string;
  addressComplement: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  display: string;
  isDefault?: boolean;
  label?: string;
  recipient: string;
}
