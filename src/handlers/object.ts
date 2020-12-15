import { validate } from '../validate';
import type { DefaultRule, ValidationRule, ValidationSchema } from '../validation-handlers';
import { ValidationError } from '../ValidationError';

export default (x: any, rule: Partial<ObjectRule>, propertyPath: string, isQuery?: boolean): object => {
	if (!x || typeof x !== 'object' || Array.isArray(x) || x instanceof Symbol) {
		throw new ValidationError(propertyPath, x, rule as ObjectRule);
	}

	if (rule.instanceOf && x instanceof rule.instanceOf) {
		return x as object;
	}

	const out: { [key: string]: any } = {};

	if (rule.schema) {
		const entries = Object.entries(rule.schema);

		for (const [key, schemaRule] of entries) {
			const value = validate((x as { [key: string]: any })[key], schemaRule, `${propertyPath}.${key}`, isQuery);

			if (value === void 0) {
				continue;
			}

			out[key] = value;
		}
	} else if (rule.nested) {
		const keys = Object.keys(x as any);
		const nestedRule = rule.nested;

		for (const key of keys) {
			const value = validate((x as { [key: string]: any })[key], nestedRule, `${propertyPath}.${key}`, isQuery);

			if (value === void 0) {
				continue;
			}

			out[key] = value;
		}
	}

	if (rule.unknown) {
		const keys = rule.schema ? Object.keys(rule.schema) : null;
		let unknownKeys = Object.keys(x);

		if (keys) {
			unknownKeys = unknownKeys.filter((k) => !keys!.includes(k));
		}

		for (const key of unknownKeys) {
			out[key] = x[key];
		}
	}

	if (rule.instanceOf) {
		Object.setPrototypeOf(out, rule.instanceOf.prototype);
	}

	return out;
};

export interface ObjectRule<T = object> extends DefaultRule<T> {
	type: 'object';
	instanceOf?: new () => any;
	nested?: ValidationRule;
	schema?: ValidationSchema;
	unknown?: boolean;
}
