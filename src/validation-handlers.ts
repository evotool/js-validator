import arrayHandler, { ArrayRule } from './handlers/array';
import booleanHandler, { BooleanRule } from './handlers/boolean';
import dateHandler, { DateRule } from './handlers/date';
import numberHandler, { NumberRule } from './handlers/number';
import objectHandler, { ObjectRule } from './handlers/object';
import stringHandler, { StringRule } from './handlers/string';

export const ValidationHandlers = new Map<string, ValidationHandler>();

ValidationHandlers.set('array', arrayHandler);
ValidationHandlers.set('object', objectHandler);
ValidationHandlers.set('boolean', booleanHandler);
ValidationHandlers.set('number', numberHandler);
ValidationHandlers.set('string', stringHandler);
ValidationHandlers.set('date', dateHandler);

export type ValidationHandler = (x: unknown, rule: DefaultRule, propertyPath: string, isQuery?: boolean) => any;

export interface DefaultRule<T = any> {
	type?: any;
	default?: ((x: any, r: ValidationRule) => any) | any;
	parse?(x: any, rule: PrimitiveRule): T;
	optional?: boolean;
}

export { ArrayRule, BooleanRule, DateRule, NumberRule, ObjectRule, StringRule };

export type PrimitiveRule<T = any> =
| DefaultRule<T>
| BooleanRule<T>
| StringRule<T>
| NumberRule<T>
| DateRule<T>
| ArrayRule<T>
| ObjectRule<T>;

export type ValidationRule<T = any> =
| PrimitiveRule<T>
| PrimitiveRule<T>[];

export interface ValidationSchema {
	[key: string]: ValidationRule;
}
