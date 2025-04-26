import { ObjectType } from 'src/common/types/common.type';

export interface ITransformResult {
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  data?: ObjectType;
  where?: ObjectType;
}
