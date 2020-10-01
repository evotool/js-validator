import { DefaultRule } from '../validation-handlers';
import { ValidationError } from '../ValidationError';

export default (x: unknown, rule: Partial<BooleanRule>, propertyPath: string, isQuery?: boolean): boolean => {
	if (x === true || (isQuery && x === '1') || rule.truthy?.includes(x)) {
		return true;
	}

	if (x === false || (isQuery && x === '0') || rule.falsy?.includes(x)) {
		return false;
	}

	throw new ValidationError(propertyPath, x, rule as BooleanRule);
};

export interface BooleanRule<T = boolean> extends DefaultRule<T> {
	type: 'boolean';
	truthy?: any[];
	falsy?: any[];
}
