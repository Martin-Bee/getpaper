/**
 * Overview of an Order
 */
export interface OrderOverview {
  stackName: string;
  totalUnits: number;
  totalSpend: number;
  currency: string;
  rating: number;
  showOverlay: boolean;
  viewDetails?: boolean;
  showButton?: boolean;
  quantitys?: Map<string, number>;
  orderId?: string;
}
