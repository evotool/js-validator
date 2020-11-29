
import { isDeepStrictEqual } from 'util';

import { ValidationError, validate } from '../src';

describe('object', () => {
	it('should resolve all objects', (done) => {
		expect(isDeepStrictEqual(validate({}, { type: 'object' }), {})).toBeTruthy();
		expect(isDeepStrictEqual(validate({ test: 'test' }, { type: 'object' }), {})).toBeTruthy();
		expect(isDeepStrictEqual(validate({ test: 'test' }, { type: 'object', nested: { type: 'string' } }), { test: 'test' })).toBeTruthy();
		expect(isDeepStrictEqual(validate({ test: null }, { type: 'object', nested: { type: 'string', optional: true } }), { })).toBeTruthy();
		expect(isDeepStrictEqual(validate({ test: 'test' }, { type: 'object', schema: { test: { type: 'string' } } }), { test: 'test' })).toBeTruthy();
		expect(isDeepStrictEqual(validate({}, { type: 'object', schema: { test: { type: 'string', optional: true } } }), {})).toBeTruthy();
		expect(isDeepStrictEqual(validate(new Error(), { type: 'object' }), {})).toBeTruthy();
		expect(isDeepStrictEqual(validate(new Date(), { type: 'object' }), {})).toBeTruthy();
		expect(validate(new Date(), { type: 'object', instanceOf: Date })).toBeInstanceOf(Date);
		expect(validate(new Error(), { type: 'object', instanceOf: Error })).toBeInstanceOf(Error);
		expect(validate({ message: 'test' }, { type: 'object', instanceOf: Error })).toBeInstanceOf(Error);

		const output = validate({ message: 'test' }, { type: 'object', schema: { message: { type: 'string' } }, parse: (x) => new Error(x.message) });
		expect(output).toBeInstanceOf(Error);
		expect((output as Error).message).toBe('test');

		expect(isDeepStrictEqual(validate(/asd/g, { type: 'object' }), {})).toBeTruthy();
		done();
	});

	it('should resolve all non-objects', (done) => {
		expect(validate(undefined, { type: 'object', optional: true })).toBeUndefined();
		expect(validate(null, { type: 'object', optional: true })).toBeUndefined();
		expect(validate(null, { type: 'object', default: null })).toBeNull();
		expect(validate(NaN, { type: 'object', default: NaN })).toBeNaN();
		expect(validate(Infinity, { type: 'object', default: Infinity })).toBe(Infinity);
		done();
	});

	it('should reject all objects', (done) => {
		expect(() => validate({}, { type: 'object', schema: { test: { type: 'string' } } })).toThrowError(ValidationError);
		expect(() => validate({ test: false }, { type: 'object', schema: { test: { type: 'string' } } })).toThrowError(ValidationError);
		expect(() => validate({ test: null }, { type: 'object', schema: { test: { type: 'string' } } })).toThrowError(ValidationError);
		done();
	});

	it('should reject all non-objects', (done) => {
		expect(() => validate(NaN, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(Infinity, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate('12,34', { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(null, { type: 'object' })).toThrowError(ValidationError); // null is not expected object
		expect(() => validate(undefined, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(void 0, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(Error, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(Function, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(RegExp, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(() => {}, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(class {}, { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate([], { type: 'object' })).toThrowError(ValidationError); // array is not expected object
		expect(() => validate(['1', '2'], { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(['12'], { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(Symbol('test'), { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(Symbol(undefined), { type: 'object' })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'object', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'object', default: void 0 })).toThrowError(ValidationError);
		expect(() => validate(void 0, { type: 'object', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(void 0, { type: 'object', default: void 0 })).toThrowError(ValidationError);
		done();
	});
});
