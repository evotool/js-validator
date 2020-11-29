import { isDeepStrictEqual } from 'util';

/* eslint-disable no-throw-literal */
import { PrimitiveRule, ValidationHandlers, ValidationRule } from './validation-handlers';
import { ValidationError } from './ValidationError';

function validatePrimitive(x: unknown, rule: PrimitiveRule, propertyPath: string, isQuery?: boolean): unknown {
	if (!rule) {
		throw new TypeError('Rule is null or undefined');
	}

	try {
		const validator = ValidationHandlers.get(rule.type);

		if (!validator) {
			throw new ValidationError(propertyPath, x, rule);
		}

		x = validator(x, rule as any, propertyPath, isQuery);
	} catch (err) {
		try {
			if (rule.default === void 0) {
				throw void 0;
			}

			const defaultValue = typeof rule.default === 'function' ? rule.default(x, rule) : rule.default;

			if (x === void 0) {
				x = defaultValue;
			} else if (!isDeepStrictEqual(x, defaultValue)) {
				throw void 0;
			}
		} catch {
			if (rule.optional) {
				return;
			} else {
				throw err;
			}
		}
	}

	if (rule.parse) {
		return rule.parse(x, rule);
	}

	return x;
}

export function validate(x: unknown, rule: ValidationRule, propertyPath: string = 'this', isQuery?: boolean): unknown {
	if (Array.isArray(rule)) {
		for (const r of rule) {
			try {
				return validatePrimitive(x, r, propertyPath, isQuery);
			} catch {}
		}

		throw new ValidationError(propertyPath, x, rule);
	}

	return validatePrimitive(x, rule, propertyPath, isQuery);
}
