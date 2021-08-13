import { isDeepStrictEqual } from 'util';

/* eslint-disable no-throw-literal */
import type { PrimitiveRule, ValidationRule } from './validation-handlers';
import { ValidationHandlers } from './validation-handlers';
import { ValidationError } from './ValidationError';

function validatePrimitive(x: any, rule: PrimitiveRule, propertyPath: string, isQuery?: boolean): any {
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
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw void 0;
      }

      const defaultValue = typeof rule.default === 'function' ? rule.default(x, rule) : rule.default;

      if (x === void 0) {
        x = defaultValue;
      } else if (!isDeepStrictEqual(x, defaultValue)) {
        // eslint-disable-next-line @typescript-eslint/no-throw-literal
        throw void 0;
      }
    } catch {
      if (rule.optional) {
        return;
      }

      throw err;
    }
  }

  if (rule.parse) {
    return rule.parse(x, rule);
  }

  return x;
}

export function validate(x: any, rule: ValidationRule, propertyPath: string = 'this', isQuery?: boolean): any {
  if (Array.isArray(rule)) {
    let hasOptional = false;

    for (const r of rule) {
      try {
        const value = validatePrimitive(x, r, propertyPath, isQuery);

        if (r.optional && value === void 0) {
          if (!hasOptional) {
            hasOptional = true;
          }

          continue;
        }

        return value;
      } catch {}
    }

    if (hasOptional) {
      return;
    }

    throw new ValidationError(propertyPath, x, rule);
  }

  return validatePrimitive(x, rule, propertyPath, isQuery);
}
