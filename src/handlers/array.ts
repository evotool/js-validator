import { validate } from '../validate';
import { DefaultRule, ValidationRule } from '../validation-handlers';
import { ValidationError } from '../ValidationError';

export default (x: unknown, rule: Partial<ArrayRule>, propertyPath: string, isQuery?: boolean): any[] => {
	if (!Array.isArray(x)) {
		if (!isQuery) {
			throw new ValidationError(propertyPath, x, rule as ArrayRule);
		}

		x = x === void 0 ? [] : [x];
	}

	const len = (x as any[]).length;

	if (
		(Number.isFinite(rule.length) && rule.length !== len)
		|| (Number.isFinite(rule.min) && len < rule.min!)
		|| (Number.isFinite(rule.max) && len > rule.max!)
	) {
		throw new ValidationError(propertyPath, x, rule as ArrayRule);
	}

	let out: any[];

	if (rule.nested) {
		out = [];

		const nestedRule = rule.nested;

		for (let i = 0; i < len; i++) {
			out.push(validate((x as any[])[i], nestedRule, `${propertyPath}[${i}]`, isQuery));
		}
	} else {
		out = Array.from(x as any[]);
	}

	return out;
};

export interface ArrayRule<T = any[]> extends DefaultRule<T> {
	type: 'array';
	nested?: ValidationRule;
	length?: number;
	min?: number;
	max?: number;
}
