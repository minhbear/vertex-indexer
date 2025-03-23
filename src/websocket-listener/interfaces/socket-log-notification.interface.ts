export interface ILogNotificationContext {
  slot: number;
}

export interface ILogNotificationAccount {
  data: string[];
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
  space: number;
}

export interface ILogNotificationValue {
  pubkey: string;
  account: ILogNotificationAccount;
}

export interface ILogNotificationResult {
  context: ILogNotificationContext;
  value: ILogNotificationValue;
}

export interface ILogNotificationParams {
  result: ILogNotificationResult;
  subscription: number;
}

export interface ILogsNotificationRPCResponse {
  jsonrpc: string;
  method: string;
  params: ILogNotificationParams;
}
