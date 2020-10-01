
import { ValidationError, deepEqual, validate } from '../src';

describe('array', () => {
	it('should resolve all arrays', (done) => {
		expect(deepEqual(validate([], { type: 'array' }), [])).toBeTruthy();
		expect(deepEqual(validate([1, 2], { type: 'array', nested: { type: 'number' } }), [1, 2])).toBeTruthy();
		expect(deepEqual(validate(['  test  '], { type: 'array', nested: { type: 'string', trim: true } }), ['test'])).toBeTruthy();
		expect(deepEqual(validate(['1', { hello: ' world  ' }], {
			type: 'array',
			nested: [
				{ type: 'object', nested: { type: 'string', trim: true } },
				{ type: 'number' },
			],
		}), [1, { hello: 'world' }])).toBeTruthy();
		done();
	});

	it('should resolve all non-arrays', (done) => {
		expect(deepEqual(validate('test', { type: 'array' }, undefined, true), ['test'])).toBeTruthy();
		expect(deepEqual(validate('', { type: 'array' }, undefined, true), [''])).toBeTruthy();
		expect(deepEqual(validate('', { type: 'array', default: null }, undefined, true), [''])).toBeTruthy();
		expect(deepEqual(validate(void 0, { type: 'array', default: null, parse: () => [] }), [])).toBeTruthy();

		expect(validate(undefined, { type: 'array', default: null })).toBeNull();
		expect(validate(undefined, { type: 'array', optional: true })).toBeUndefined();
		expect(validate(null, { type: 'array', default: null })).toBeNull();
		done();
	});

	it('should reject all arrays', (done) => {
		expect(() => validate([], { type: 'array', min: 1 })).toThrowError(ValidationError);
		expect(() => validate([1], { type: 'array', min: 2 })).toThrowError(ValidationError);
		expect(() => validate([1], { type: 'array', max: 0 })).toThrowError(ValidationError);
		expect(() => validate([1, 2], { type: 'array', max: 1 })).toThrowError(ValidationError);
		expect(() => validate([1, 2], { type: 'array', length: 1 })).toThrowError(ValidationError);
		expect(() => validate([1, 2], { type: 'array', min: 3, max: 1 })).toThrowError(ValidationError);
		expect(() => validate([1, 'lol'], { type: 'array', nested: { type: 'number' } })).toThrowError(ValidationError);
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
		expect(() => validate(void 0, { type: 'array' })).toThrowError(ValidationError);
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
		expect(() => validate(undefined, { type: 'array', default: void 0 })).toThrowError(ValidationError);
		expect(() => validate(void 0, { type: 'array', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(void 0, { type: 'array', default: void 0 })).toThrowError(ValidationError);
		done();
	});
});
