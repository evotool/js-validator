/* eslint-disable @typescript-eslint/no-unsafe-return */
import { isDeepStrictEqual } from 'util';

import { ValidationError, validate } from '../src';

describe('object', () => {
  it('should resolve all objects', (done) => {
    expect(isDeepStrictEqual(validate({}, { type: 'object' }), {})).toBe(true);
    expect(isDeepStrictEqual(validate({ test: 'test' }, { type: 'object' }), {})).toBe(true);
    expect(isDeepStrictEqual(validate({ test: 'test' }, { type: 'object', nested: { type: 'string' } }), { test: 'test' })).toBe(true);
    expect(isDeepStrictEqual(validate({ test: null }, { type: 'object', nested: { type: 'string', optional: true } }), { })).toBe(true);
    expect(isDeepStrictEqual(validate({ test: 'test' }, { type: 'object', schema: { test: { type: 'string' } } }), { test: 'test' })).toBe(true);
    expect(isDeepStrictEqual(validate({}, { type: 'object', schema: { test: { type: 'string', optional: true } } }), {})).toBe(true);
    expect(isDeepStrictEqual(validate(new Error(), { type: 'object' }), {})).toBe(true);
    expect(isDeepStrictEqual(validate(new Date(), { type: 'object' }), {})).toBe(true);
    expect(isDeepStrictEqual(validate({ message: 'test', unsetted: undefined }, { type: 'object', unknown: true }), { message: 'test', unsetted: undefined })).toBe(true);
    expect(isDeepStrictEqual(validate({ number: '10', unsetted: undefined }, { type: 'object', schema: { number: { type: 'number' } }, unknown: true }), { number: 10, unsetted: undefined })).toBe(true);
    expect(validate(new Date(), { type: 'object', instanceOf: Date })).toBeInstanceOf(Date);
    expect(validate(new Error(), { type: 'object', instanceOf: Error })).toBeInstanceOf(Error);
    expect(validate({ message: 'test' }, { type: 'object', instanceOf: Error })).toBeInstanceOf(Error);

    const output = validate({ message: 'test' }, { type: 'object', schema: { message: { type: 'string' } }, parse: (x) => new Error(x.message) });
    expect(output).toBeInstanceOf(Error);
    expect((output as Error).message).toBe('test');

    expect(isDeepStrictEqual(validate(/asd/g, { type: 'object' }), {})).toBe(true);
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
    expect(() => validate({ number: 'NaN', unsetted: undefined }, { type: 'object', schema: { number: { type: 'number' } }, unknown: true })).toThrowError(ValidationError);
    done();
  });

  it('should reject all non-objects', (done) => {
    expect(() => validate(NaN, { type: 'object' })).toThrowError(ValidationError);
    expect(() => validate(Infinity, { type: 'object' })).toThrowError(ValidationError);
    expect(() => validate('12,34', { type: 'object' })).toThrowError(ValidationError);
    expect(() => validate(null, { type: 'object' })).toThrowError(ValidationError); // null is not expected object
    expect(() => validate(undefined, { type: 'object' })).toThrowError(ValidationError);
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
    expect(() => validate(undefined, { type: 'object', unknown: true })).toThrowError(ValidationError);
    done();
  });
});
