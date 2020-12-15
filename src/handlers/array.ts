import { validate } from '../validate';
import type { DefaultRule, ValidationRule } from '../validation-handlers';
import { ValidationError } from '../ValidationError';

export default (x: any, rule: Partial<ArrayRule>, propertyPath: string, isQuery?: boolean): any[] => {
	if (!Array.isArray(x)) {
		if (!isQuery) {
			throw new ValidationError(propertyPath, x, rule as ArrayRule);
		}

		x = x === void 0 ? [] : [x];
	}

	const len = x.length;

	if (
		(Number.isFinite(rule.length) && rule.length !== len)
		|| (Number.isFinite(rule.min) && len < rule.min!)
		|| (Number.isFinite(rule.max) && len > rule.max!)
	) {
		throw new ValidationError(propertyPath, x, rule as ArrayRule);
	}

	let out: any[];

	if (rule.schema) {
		out = [];

		if (!Array.isArray(rule.schema) || rule.schema.length > len || (rule.schema.length < len && !rule.unknown && !rule.nested)) {
			throw new ValidationError(propertyPath, x, rule as ArrayRule);
		}

		for (let i = 0, r: ValidationRule | undefined; i < len; i++) {
			r = rule.schema[i] || rule.nested;
			out.push(r ? validate(x[i], r, `${propertyPath}[${i}]`, isQuery) : x[i]);
		}
	} else if (rule.nested) {
		out = [];

		const nestedRule = rule.nested;

		for (let i = 0; i < len; i++) {
			out.push(validate(x[i], nestedRule, `${propertyPath}[${i}]`, isQuery));
		}
	} else {
		out = rule.unknown ? Array.from(x) : [];
	}

	return out;
};

export interface ArrayRule<T = any[]> extends DefaultRule<T> {
	type: 'array';
	nested?: ValidationRule;
	schema?: ValidationRule[];
	length?: number;
	min?: number;
	max?: number;
	unknown?: boolean;
}
