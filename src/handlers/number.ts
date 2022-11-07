import type { DefaultRule } from '../validation-handlers';
import { ValidationError } from '../ValidationError';

export const numberHandler = (x: any, rule: Partial<NumberRule>, propertyPath: string): number => {
  if ((typeof x !== 'number' && typeof x !== 'string') || !isFinite(x as number) || x === '') {
    throw new ValidationError(propertyPath, x, rule as NumberRule);
  }

  let num = +(x as number);

  if (Number.isFinite(rule.digits!) && rule.digits! > 0) {
    const m = 10 ** +rule.digits!;
    const roundingFn = Math[rule.roundingFn || 'round'];

    num = roundingFn(num * m) / m;
  }

  if (
    (rule.integer && !Number.isInteger(num)) ||
		(Number.isFinite(rule.min) && num < rule.min!) ||
		(Number.isFinite(rule.max) && num > rule.max!) ||
		(rule.values && !rule.values.includes(num))
  ) {
    throw new ValidationError(propertyPath, x, rule as NumberRule);
  }

  return num;
};

export interface NumberRule<T = number> extends DefaultRule<T> {
  type: 'number';
  integer?: boolean;
  digits?: number;
  roundingFn?: 'floor' | 'round' | 'ceil';
  min?: number;
  max?: number;
  values?: number[];
}
