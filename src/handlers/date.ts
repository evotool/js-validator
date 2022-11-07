import type { DefaultRule } from '../validation-handlers';
import { ValidationError } from '../ValidationError';

export const dateHandler = (x: any, rule: Partial<DateRule>, propertyPath: string): Date => {
  if (!(x instanceof Date) && typeof x !== 'string' && typeof x !== 'number') {
    throw new ValidationError(propertyPath, x, rule as DateRule);
  }

  const ts: number = +new Date(x as Date);

  if (isNaN(ts)) {
    throw new ValidationError(propertyPath, x, rule as DateRule);
  }

  const min = +new Date(typeof rule.min === 'function' ? rule.min() : rule.min!);
  const max = +new Date(typeof rule.max === 'function' ? rule.max() : rule.max!);

  if ((isFinite(min) && ts < min) || (isFinite(max) && ts > max)) {
    throw new ValidationError(propertyPath, x, rule as DateRule);
  }

  return new Date(ts);
};

export interface DateRule<T = Date> extends DefaultRule<T> {
  type: 'date';
  min?: number | string | Date | (() => number | string | Date);
  max?: number | string | Date | (() => number | string | Date);
}
