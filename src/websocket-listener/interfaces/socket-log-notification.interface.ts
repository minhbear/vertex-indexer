export interface ILogNotificationContext {
  slot: number;
}

export interface ILogNotificationValue {
  data: string[];
  executable: boolean;
  lamports: number;
  owner: string;
  rentEpoch: number;
  space: number;
}

export interface ILogNotificationResult {
  context: ILogNotificationContext;
  value: ILogNotificationValue;
}

export interface ILogNotificationParams {
  result: ILogNotificationResult;
  subscription: number;
}

export interface ILogsNotificationAccountChangeRPCResponse {
  jsonrpc: string;
  method: string;
  params: ILogNotificationParams;
}

export interface ILogSuccessSubscribeRPCResponse {
  jsonrpc: string;
  result: number;
  id: number;
}
