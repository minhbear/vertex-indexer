import { forEach } from 'lodash';
import { SelectQueryBuilder } from 'typeorm';
import { SortDirection } from '../enum/common.enum';

export const buildOrderBy = (
  query: SelectQueryBuilder<any>,
  sorts: { [k: string]: SortDirection },
): SelectQueryBuilder<any> => {
  forEach(sorts, (value: SortDirection, key) => {
    query.addOrderBy(key, value);
  });
  return query;
};
