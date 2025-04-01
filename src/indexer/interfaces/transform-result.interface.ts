export interface ITransformResult {
  action: 'INSERT' | 'UPDATE' | 'DELETE';
  data: any;
}
