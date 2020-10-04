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
	default?: any;
	parse?(x: any, rule: PrimitiveRule): T;
	optional?: boolean;
}

export { ArrayRule, BooleanRule, DateRule, NumberRule, ObjectRule, StringRule };

export type PrimitiveRule<T = any> =
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

type DefaultRuleType<Rule extends DefaultRule> = (
	'default' extends keyof Rule ? (
		Rule['default'] extends (...args: any) => any ? ReturnType<Rule['default']> :
			(
				Rule['default'] extends undefined ? never :
					Rule['default']
			)
	) : never
) | (
	Rule['optional'] extends true ? undefined :
		never
);

type ArrayRuleType<Rule extends ArrayRule> = ArrayTupleType<Rule, (Rule['nested'] extends ValidationRule ? RuleType<DecomposeRule<Rule['nested']>> : any)[]> | DefaultRuleType<Rule>;
type n = number;
type ArrayTupleType<Rule extends ArrayRule, T extends any[]> =
Rule['length'] extends 0 ? [] :
	Rule['length'] extends 1 ? [T[n]] :
		Rule['length'] extends 2 ? [T[n], T[n]] :
			Rule['length'] extends 3 ? [T[n], T[n], T[n]] :
				Rule['length'] extends 4 ? [T[n], T[n], T[n], T[n]] :
					Rule['length'] extends 5 ? [T[n], T[n], T[n], T[n], T[n]] :
						Rule['length'] extends 6 ? [T[n], T[n], T[n], T[n], T[n], T[n]] :
							Rule['length'] extends 7 ? [T[n], T[n], T[n], T[n], T[n], T[n], T[n]] :
								Rule['length'] extends 8 ? [T[n], T[n], T[n], T[n], T[n], T[n], T[n], T[n]] :
									Rule['length'] extends 9 ? [T[n], T[n], T[n], T[n], T[n], T[n], T[n], T[n], T[n]] :
										Rule['length'] extends 10 ? [T[n], T[n], T[n], T[n], T[n], T[n], T[n], T[n], T[n], T[n]] :
											T;

type BooleanRuleType<Rule extends BooleanRule> = boolean | DefaultRuleType<Rule>;

type DateRuleType<Rule extends DateRule> = Date | DefaultRuleType<Rule>;

type NumberRuleType<Rule extends NumberRule> = (
	Rule['values'] extends any[] ? Rule['values'][number] : number
) | DefaultRuleType<Rule>;

type StringRuleType<Rule extends StringRule> = (
	Rule['values'] extends any[] ? Rule['values'][number] : string
) | DefaultRuleType<Rule>;

type ObjectRuleType<Rule extends ObjectRule> = (
	Rule['schema'] extends ValidationSchema ? SchemaType<Rule['schema']> :
		Rule['nested'] extends ValidationRule ? ObjectNestedType<Rule['nested']> :
			{ [key: string]: any }
) | DefaultRuleType<Rule>;

export type RuleType<Rule extends PrimitiveRule> =
Rule['parse'] extends (...args: any) => any ? ReturnType<Rule['parse']> :
	Rule extends ArrayRule ? ArrayRuleType<Rule> :
		Rule extends BooleanRule ? BooleanRuleType<Rule> :
			Rule extends DateRule ? DateRuleType<Rule> :
				Rule extends NumberRule ? NumberRuleType<Rule> :
					Rule extends ObjectRule ? ObjectRuleType<Rule> :
						Rule extends StringRule ? StringRuleType<Rule> :
							never;

export type SchemaType<B extends ValidationSchema> = {
	[P in NonRequiredKeys<B>]?: RuleType<DecomposeRule<B[P]>>;
} & {
	[P in RequiredKeys<B>]: RuleType<DecomposeRule<B[P]>>;
};

interface ObjectNestedType<Rule extends ValidationRule> {
	[key: string]: RuleType<DecomposeRule<Rule>>;
}

type DecomposeRule<Rule extends ValidationRule> = Rule extends PrimitiveRule[] ? Rule[number] : Rule extends PrimitiveRule ? Rule : never;
type NonRequiredKeys<B extends ValidationSchema, K extends keyof B = keyof B> = DecomposeRule<B[K]>['optional'] extends true ? K : never;
type RequiredKeys<B extends ValidationSchema, K extends keyof B = keyof B> = DecomposeRule<B[K]>['optional'] extends true ? never : K;
