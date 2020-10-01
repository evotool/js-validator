
import { ValidationError, deepEqual, validate } from '../src';

describe('common', () => {
	it('should check function "deepEqual"', (done) => {
		expect(new ValidationError('root', 'test', { type: 'number' })).toBeInstanceOf(ValidationError);
		expect(new ValidationError('root', 'test', { type: 'number' }).message).toBe(`root 'test' does not apply rule { type: 'number' }`);

		expect(deepEqual(null, undefined)).toBe(false);
		expect(deepEqual(undefined, null)).toBe(false);
		expect(deepEqual(undefined, [])).toBe(false);
		expect(deepEqual(undefined, 0)).toBe(false);
		expect(deepEqual(undefined, '')).toBe(false);
		expect(deepEqual(undefined, false)).toBe(false);
		expect(deepEqual(undefined, NaN)).toBe(false);

		expect(deepEqual(NaN, NaN)).toBe(true);
		expect(deepEqual(Infinity, Infinity)).toBe(true);
		expect(deepEqual(NaN, Infinity)).toBe(false);

		expect(deepEqual(1, 1)).toBe(true);
		expect(deepEqual(1, 2)).toBe(false);
		expect(deepEqual(1, '1')).toBe(false);
		expect(deepEqual(0, '0')).toBe(false);
		expect(deepEqual(1, true)).toBe(false);
		expect(deepEqual(0, false)).toBe(false);
		expect(deepEqual(1, NaN)).toBe(false);
		expect(deepEqual(1, 1.000000000000001)).toBe(false);

		expect(deepEqual('Equal', 'Equal')).toBe(true);
		expect(deepEqual('It is test', 'This is test')).toBe(false);

		expect(deepEqual([], [])).toBe(true);
		expect(deepEqual([1], [])).toBe(false);
		expect(deepEqual([1], ['1'])).toBe(false);
		expect(deepEqual([1], [1])).toBe(true);
		expect(deepEqual([1], [1, 1])).toBe(false);
		expect(deepEqual([1], [2, 3])).toBe(false);
		expect(deepEqual([''], [''])).toBe(true);
		expect(deepEqual([{ }], [])).toBe(false);
		expect(deepEqual([{ }], [{ }])).toBe(true);
		expect(deepEqual([{ test: undefined }], [{ test: undefined }])).toBe(true);
		expect(deepEqual([{ test: undefined }], [{ }])).toBe(false);
		expect(deepEqual([{ }], [{ test: undefined }])).toBe(false);
		expect(deepEqual([{ }], [{ }, { }])).toBe(false);

		expect(deepEqual(true, true)).toBe(true);
		expect(deepEqual(true, false)).toBe(false);

		expect(deepEqual('', '')).toBe(true);
		expect(deepEqual('', 'hell')).toBe(false);
		expect(deepEqual('hello', 'hell')).toBe(false);
		expect(deepEqual('hola', 'hello')).toBe(false);

		expect(deepEqual([{ test: [{ test: ['test', 1] }] }], [{ test: [{ test: ['test', 1] }] }])).toBe(true);
		expect(deepEqual([{ test: [{ test: ['test', 1] }] }], [{ test: [{ test: ['test'] }] }])).toBe(false);
		expect(deepEqual([{ test: [{ test: ['test', 1] }, 1] }], [{ test: [{ test: ['test', 1] }] }])).toBe(false);

		const ts = Date.now();
		expect(deepEqual(new Date(ts), new Date(ts))).toBe(true);
		expect(deepEqual(new Date(ts), new Date(ts + 1))).toBe(false);

		expect(deepEqual(new Error('Welcome'), new Error('Welcome'))).toBe(true);
		expect(deepEqual(new Error('Welcome'), new Error('Welcome!'))).toBe(false);

		done();
	});

	it('should reject common cases', (done) => {
		expect(() => validate({}, undefined!)).toThrowError(TypeError);
		expect(() => validate({}, { type: '__unknown_type__' })).toThrowError(ValidationError);

		/**
		 * VALIDATING WHEN DEFAULT VALUE IS SET
		 */

		expect(() => validate(undefined, { type: 'number', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'string', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'boolean', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'date', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'object', default: undefined })).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'array', default: undefined })).toThrowError(ValidationError);

		expect(deepEqual(validate(null, { type: 'number', default: null }), null)).toBe(true);
		expect(deepEqual(validate(null, { type: 'string', default: null }), null)).toBe(true);
		expect(deepEqual(validate(null, { type: 'boolean', default: null }), null)).toBe(true);
		expect(deepEqual(validate(null, { type: 'date', default: null }), null)).toBe(true);
		expect(deepEqual(validate(null, { type: 'object', default: null }), null)).toBe(true);
		expect(deepEqual(validate(null, { type: 'array', default: null }), null)).toBe(true);

		expect(deepEqual(validate(0, { type: 'number', default: 0 }), 0)).toBe(true);
		expect(deepEqual(validate(0, { type: 'string', default: 0 }), '0')).toBe(true); // number to string!
		expect(deepEqual(validate(0, { type: 'boolean', default: 0 }), 0)).toBe(true);
		expect(deepEqual(validate(0, { type: 'date', default: 0 }), new Date(0))).toBe(true); // ts number to date!
		expect(deepEqual(validate(0, { type: 'object', default: 0 }), 0)).toBe(true);
		expect(deepEqual(validate(0, { type: 'array', default: 0 }), 0)).toBe(true);

		expect(deepEqual(validate(-1, { type: 'number', default: -1 }), -1)).toBe(true);
		expect(deepEqual(validate(-1, { type: 'string', default: -1 }), '-1')).toBe(true); // number to string!
		expect(deepEqual(validate(-1, { type: 'boolean', default: -1 }), -1)).toBe(true);
		expect(deepEqual(validate(-1, { type: 'date', default: -1 }), new Date(-1))).toBe(true); // ts number to date!
		expect(deepEqual(validate(-1, { type: 'object', default: -1 }), -1)).toBe(true);
		expect(deepEqual(validate(-1, { type: 'array', default: -1 }), -1)).toBe(true);

		expect(deepEqual(validate(1601570355251, { type: 'number', default: 1601570355251 }), 1601570355251)).toBe(true);
		expect(deepEqual(validate(1601570355251, { type: 'string', default: 1601570355251 }), '1601570355251')).toBe(true); // number to string!
		expect(deepEqual(validate(1601570355251, { type: 'boolean', default: 1601570355251 }), 1601570355251)).toBe(true);
		expect(deepEqual(validate(1601570355251, { type: 'date', default: 1601570355251 }), new Date(1601570355251))).toBe(true); // ts number to date!
		expect(deepEqual(validate(1601570355251, { type: 'object', default: 1601570355251 }), 1601570355251)).toBe(true);
		expect(deepEqual(validate(1601570355251, { type: 'array', default: 1601570355251 }), 1601570355251)).toBe(true);

		expect(deepEqual(validate(true, { type: 'number', default: true }), true)).toBe(true);
		expect(deepEqual(validate(true, { type: 'string', default: true }), true)).toBe(true);
		expect(deepEqual(validate(true, { type: 'boolean', default: true }), true)).toBe(true);
		expect(deepEqual(validate(true, { type: 'date', default: true }), true)).toBe(true);
		expect(deepEqual(validate(true, { type: 'object', default: true }), true)).toBe(true);
		expect(deepEqual(validate(true, { type: 'array', default: true }), true)).toBe(true);

		expect(deepEqual(validate(false, { type: 'number', default: false }), false)).toBe(true);
		expect(deepEqual(validate(false, { type: 'string', default: false }), false)).toBe(true);
		expect(deepEqual(validate(false, { type: 'boolean', default: false }), false)).toBe(true);
		expect(deepEqual(validate(false, { type: 'date', default: false }), false)).toBe(true);
		expect(deepEqual(validate(false, { type: 'object', default: false }), false)).toBe(true);
		expect(deepEqual(validate(false, { type: 'array', default: false }), false)).toBe(true);

		expect(deepEqual(validate('', { type: 'number', default: '' }), '')).toBe(true);
		expect(deepEqual(validate('', { type: 'string', default: '' }), '')).toBe(true);
		expect(deepEqual(validate('', { type: 'boolean', default: '' }), '')).toBe(true);
		expect(deepEqual(validate('', { type: 'date', default: '' }), '')).toBe(true);
		expect(deepEqual(validate('', { type: 'object', default: '' }), '')).toBe(true);
		expect(deepEqual(validate('', { type: 'array', default: '' }), '')).toBe(true);

		expect(deepEqual(validate('123', { type: 'number', default: '123' }), 123)).toBe(true); // string to number!
		expect(deepEqual(validate('123', { type: 'string', default: '123' }), '123')).toBe(true);
		expect(deepEqual(validate('123', { type: 'boolean', default: '123' }), '123')).toBe(true);
		expect(deepEqual(validate('123', { type: 'date', default: '123' }), new Date('123'))).toBe(true); // year date!
		expect(deepEqual(validate('123', { type: 'object', default: '123' }), '123')).toBe(true);
		expect(deepEqual(validate('123', { type: 'array', default: '123' }), '123')).toBe(true);

		expect(deepEqual(validate('yes', { type: 'number', default: 'yes' }), 'yes')).toBe(true);
		expect(deepEqual(validate('yes', { type: 'string', default: 'yes' }), 'yes')).toBe(true);
		expect(deepEqual(validate('yes', { type: 'boolean', default: 'yes' }), 'yes')).toBe(true);
		expect(deepEqual(validate('yes', { type: 'date', default: 'yes' }), 'yes')).toBe(true);
		expect(deepEqual(validate('yes', { type: 'object', default: 'yes' }), 'yes')).toBe(true);
		expect(deepEqual(validate('yes', { type: 'array', default: 'yes' }), 'yes')).toBe(true);

		expect(deepEqual(validate('2020-10-01', { type: 'number', default: '2020-10-01' }), '2020-10-01')).toBe(true);
		expect(deepEqual(validate('2020-10-01', { type: 'string', default: '2020-10-01' }), '2020-10-01')).toBe(true);
		expect(deepEqual(validate('2020-10-01', { type: 'boolean', default: '2020-10-01' }), '2020-10-01')).toBe(true);
		expect(deepEqual(validate('2020-10-01', { type: 'date', default: '2020-10-01' }), new Date('2020-10-01'))).toBe(true); // string to date!
		expect(deepEqual(validate('2020-10-01', { type: 'object', default: '2020-10-01' }), '2020-10-01')).toBe(true);
		expect(deepEqual(validate('2020-10-01', { type: 'array', default: '2020-10-01' }), '2020-10-01')).toBe(true);

		expect(deepEqual(validate([], { type: 'number', default: [] }), [])).toBe(true);
		expect(deepEqual(validate([], { type: 'string', default: [] }), [])).toBe(true);
		expect(deepEqual(validate([], { type: 'boolean', default: [] }), [])).toBe(true);
		expect(deepEqual(validate([], { type: 'date', default: [] }), [])).toBe(true);
		expect(deepEqual(validate([], { type: 'object', default: [] }), [])).toBe(true);
		expect(deepEqual(validate([], { type: 'array', default: [] }), [])).toBe(true);

		expect(deepEqual(validate({}, { type: 'number', default: {} }), {})).toBe(true);
		expect(deepEqual(validate({}, { type: 'string', default: {} }), {})).toBe(true);
		expect(deepEqual(validate({}, { type: 'boolean', default: {} }), {})).toBe(true);
		expect(deepEqual(validate({}, { type: 'date', default: {} }), {})).toBe(true);
		expect(deepEqual(validate({}, { type: 'object', default: {} }), {})).toBe(true);
		expect(deepEqual(validate({}, { type: 'array', default: {} }), {})).toBe(true);

		const ts = Date.now();
		expect(deepEqual(validate(new Date(ts), { type: 'number', default: new Date(ts) }), new Date(ts))).toBe(true);
		expect(deepEqual(validate(new Date(ts), { type: 'string', default: new Date(ts) }), new Date(ts))).toBe(true);
		expect(deepEqual(validate(new Date(ts), { type: 'boolean', default: new Date(ts) }), new Date(ts))).toBe(true);
		expect(deepEqual(validate(new Date(ts), { type: 'date', default: new Date(ts) }), new Date(ts))).toBe(true);
		expect(deepEqual(validate(new Date(ts), { type: 'object', default: new Date(ts) }), {})).toBe(true); // date is object!
		expect(deepEqual(validate(new Date(ts), { type: 'array', default: new Date(ts) }), new Date(ts))).toBe(true);

		/**
		 * QUERY STRING DATA
		 */

		expect(() => validate('', { type: 'number' }, undefined, true)).toThrowError(ValidationError);
		expect(deepEqual(validate('', { type: 'string' }, undefined, true), '')).toBe(true);
		expect(() => validate('', { type: 'boolean' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate('', { type: 'date' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate('', { type: 'object' }, undefined, true)).toThrowError(ValidationError);
		expect(deepEqual(validate('', { type: 'array' }, undefined, true), [''])).toBe(true); // may be 1 value!

		expect(deepEqual(validate('1', { type: 'number' }, undefined, true), 1)).toBe(true);
		expect(deepEqual(validate('1', { type: 'string' }, undefined, true), '1')).toBe(true);
		expect(deepEqual(validate('1', { type: 'boolean' }, undefined, true), true)).toBe(true);
		expect(deepEqual(validate('1', { type: 'date' }, undefined, true), new Date('1'))).toBe(true);
		expect(() => validate('1', { type: 'object' }, undefined, true)).toThrowError(ValidationError);
		expect(deepEqual(validate('1', { type: 'array' }, undefined, true), ['1'])).toBe(true); // may be 1 value!

		expect(deepEqual(validate('0', { type: 'number' }, undefined, true), 0)).toBe(true);
		expect(deepEqual(validate('0', { type: 'string' }, undefined, true), '0')).toBe(true);
		expect(deepEqual(validate('0', { type: 'boolean' }, undefined, true), false)).toBe(true);
		expect(deepEqual(validate('0', { type: 'date' }, undefined, true), new Date('0'))).toBe(true);
		expect(() => validate('0', { type: 'object' }, undefined, true)).toThrowError(ValidationError);
		expect(deepEqual(validate('0', { type: 'array' }, undefined, true), ['0'])).toBe(true); // may be 1 value!

		expect(() => validate(['1'], { type: 'number' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate(['1'], { type: 'string' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate(['1'], { type: 'boolean' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate(['1'], { type: 'date' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate(['1'], { type: 'object' }, undefined, true)).toThrowError(ValidationError);
		expect(deepEqual(validate(['1'], { type: 'array' }, undefined, true), ['1'])).toBe(true); // array is array!

		expect(() => validate(undefined, { type: 'number' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'string' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'boolean' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'date' }, undefined, true)).toThrowError(ValidationError);
		expect(() => validate(undefined, { type: 'object' }, undefined, true)).toThrowError(ValidationError);
		expect(deepEqual(validate(undefined, { type: 'array' }, undefined, true), [])).toBe(true); // when array is empty!

		done();
	});
});
