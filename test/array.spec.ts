
import { isDeepStrictEqual } from 'util';

import { ValidationError, validate } from '../src';

describe('array', () => {
	it('should resolve all arrays', (done) => {
		expect(isDeepStrictEqual(validate([], { type: 'array' }), [])).toBe(true);
		expect(isDeepStrictEqual(validate([1, 2], { type: 'array', nested: { type: 'number' } }), [1, 2])).toBe(true);
		expect(isDeepStrictEqual(validate(['  test  '], { type: 'array', nested: { type: 'string', trim: true } }), ['test'])).toBe(true);
		expect(isDeepStrictEqual(validate(['1', { hello: ' world  ' }], {
			type: 'array',
			nested: [
				{ type: 'object', nested: { type: 'string', trim: true } },
				{ type: 'number' },
			],
		}), [1, { hello: 'world' }])).toBe(true);
		expect(isDeepStrictEqual(validate(['1'], { type: 'array', schema: [{ type: 'number' }] }), [1])).toBe(true);
		expect(isDeepStrictEqual(validate(['1', '2'], { type: 'array', schema: [{ type: 'number' }], nested: { type: 'string' } }), [1, '2'])).toBe(true);
		expect(isDeepStrictEqual(validate(['1', undefined], { type: 'array', schema: [{ type: 'number' }], unknown: true }), [1, undefined])).toBe(true);
		expect(isDeepStrictEqual(validate(['1'], { type: 'array' }), [])).toBe(true);
		expect(isDeepStrictEqual(validate(['1'], { type: 'array', unknown: true }), ['1'])).toBe(true);
		done();
	});

	it('should resolve all non-arrays', (done) => {
		expect(isDeepStrictEqual(validate('test', { type: 'array', nested: { type: 'string' } }, undefined, true), ['test'])).toBe(true);
		expect(isDeepStrictEqual(validate('', { type: 'array', nested: { type: 'string' } }, undefined, true), [''])).toBe(true);
		expect(isDeepStrictEqual(validate('', { type: 'array', nested: { type: 'string' }, default: null }, undefined, true), [''])).toBe(true);
		expect(isDeepStrictEqual(validate(undefined, { type: 'array', default: null, parse: () => [] }), [])).toBe(true);

		expect(validate(undefined, { type: 'array', default: null })).toBeNull();
		expect(validate(undefined, { type: 'array', optional: true })).toBeUndefined();
		expect(validate(null, { type: 'array', default: null })).toBeNull();
		done();
	});

	it('should reject all arrays', (done) => {
		expect(() => validate([], { type: 'array', min: 1 })).toThrowError(ValidationError);
		expect(() => validate([1], { type: 'array', nested: { type: 'number' }, min: 2 })).toThrowError(ValidationError);
		expect(() => validate([1], { type: 'array', nested: { type: 'number' }, max: 0 })).toThrowError(ValidationError);
		expect(() => validate([1, 2], { type: 'array', nested: { type: 'number' }, max: 1 })).toThrowError(ValidationError);
		expect(() => validate([1, 2], { type: 'array', nested: { type: 'number' }, length: 1 })).toThrowError(ValidationError);
		expect(() => validate([1, 2], { type: 'array', nested: { type: 'number' }, min: 3, max: 1 })).toThrowError(ValidationError);
		expect(() => validate([1, 'lol'], { type: 'array', nested: { type: 'number' } })).toThrowError(ValidationError);
		expect(() => validate(['1', '2'], { type: 'array', schema: [{ type: 'number' }] })).toThrowError(ValidationError);
		done();
	});

	it('should reject all non-arrays', (done) => {
		expect(() => validate('', { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(NaN, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(Infinity, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(false, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(true, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(null, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(Error, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(Function, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(RegExp, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(() => {}, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(class {}, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(/asd/g, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate({ te: 'st' }, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate({}, { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(new Error(), { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(new Date(), { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(Symbol('test'), { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(Symbol(undefined), { type: 'array' })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'array', default: undefined })).toThrowError(ValidationError);
		done();
	});
});
