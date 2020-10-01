import { ValidationError, validate } from '../src';

describe('boolean', () => {
	it('should resolve all booleans', (done) => {
		expect(validate(true, { type: 'boolean' })).toBe(true);
		expect(validate(false, { type: 'boolean' })).toBe(false);
		done();
	});

	it('should resolve all non-booleans', (done) => {
		expect(validate('1', { type: 'boolean' }, undefined, true)).toBe(true);
		expect(validate('0', { type: 'boolean' }, undefined, true)).toBe(false);
		expect(validate('yep', { type: 'boolean', truthy: ['yep'], falsy: ['nope'] })).toBe(true);
		expect(validate('nope', { type: 'boolean', truthy: ['yep'], falsy: ['nope'] })).toBe(false);

		expect(validate(undefined, { type: 'boolean', optional: true })).toBeUndefined();
		expect(validate(null, { type: 'boolean', optional: true })).toBeUndefined();
		expect(validate(null, { type: 'boolean', default: null })).toBeNull();
		expect(validate(NaN, { type: 'boolean', default: NaN })).toBeNaN();
		expect(validate(Infinity, { type: 'boolean', default: Infinity })).toBe(Infinity);

		const obj = { name: 'test' };
		expect(validate(obj, { type: 'boolean', default: () => ({ name: 'test' }) })).toBe(obj);

		done();
	});

	it('should reject all booleans', (done) => {
		done();
	});

	it('should reject all non-booleans', (done) => {
		expect(() => validate(NaN, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(Infinity, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate('12,34', { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(null, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(null, { type: 'boolean', default: true })).toThrowError(ValidationError);
		expect(() => validate(null, { type: 'boolean', default: false })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(void 0, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(Error, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(Function, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(RegExp, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(() => {}, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(class {}, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate([], { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(['1', '2'], { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(['12'], { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(/asd/g, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate({ te: 'st' }, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate({}, { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(new Error(), { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(new Date(), { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(Symbol('test'), { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(Symbol(undefined), { type: 'boolean' })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'boolean', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'boolean', default: void 0 })).toThrowError(ValidationError);
		expect(() => validate(void 0, { type: 'boolean', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(void 0, { type: 'boolean', default: void 0 })).toThrowError(ValidationError);
		done();
	});
});
