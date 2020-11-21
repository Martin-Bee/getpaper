export interface StripeConnectResponse {
  success: boolean;
  data?: StripeConnectInfo;
  err?: StripeConnectError;
}

interface StripeConnectError {
  type: string;
  raw: { type: string; message: string; statusCode: number; requestId: string };
  rawType: string;
  requestId: string;
  statusCode: number;
}

export interface StripeConnectInfo {
  access_token: string;
  livemode: boolean;
  refresh_token: string;
  token_type: string;
  stripe_publishable_key: string;
  stripe_user_id: string;
  scope: string;
}
