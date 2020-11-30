import { inspect } from 'util';

import { ValidationRule } from './validation-handlers';

export class ValidationError extends Error {
	constructor(
		readonly propertyPath: string,
		readonly value: any,
		readonly rule: Partial<ValidationRule>,
	) {
		super(`${propertyPath} ${inspect(value)} does not apply rule ${inspect(rule)}`);
		Object.setPrototypeOf(this, ValidationError.prototype);
	}
}
