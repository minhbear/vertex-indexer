import { IUserScriptContext } from './user-script-context.interface';

export interface IExecuteTransformerJob {
  userScript: string;
  context: IUserScriptContext;
  fullTableName: string;
}
