import type { DefaultRule } from '../validation-handlers';
import { ValidationError } from '../ValidationError';

export const stringHandler = (x: any, rule: Partial<StringRule>, propertyPath: string): string => {
  if (Number.isFinite(x)) {
    x = (x as number).toString();
  } else if (typeof x !== 'string') {
    throw new ValidationError(propertyPath, x, rule as StringRule);
  }

  let str = x as string;

  if (rule.trim) {
    str = str.trim();
  }

  if (
    (Number.isFinite(rule.length!) && rule.length !== str.length) ||
		(Number.isFinite(rule.min!) && str.length < rule.min!) ||
		(Number.isFinite(rule.max!) && str.length > rule.max!) ||
		(rule.values && !rule.values.includes(str)) ||
		(typeof rule.pattern === 'string' && !str.includes(rule.pattern)) ||
		(rule.pattern instanceof RegExp && !rule.pattern.test(str)) ||
		(Array.isArray(rule.pattern) && !new RegExp(...rule.pattern).test(str))
  ) {
    throw new ValidationError(propertyPath, x, rule as StringRule);
  }

  return str;
};

export interface StringRule<T = string> extends DefaultRule<T> {
  type: 'string';
  min?: number;
  max?: number;
  length?: number;
  values?: string[];
  pattern?: string | [string, string?] | RegExp;
  trim?: boolean;
}
