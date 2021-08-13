/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ValidationError, validate } from '../src';

describe('number', () => {
  it('should resolve all numbers', (done) => {
    expect(validate('12345', [{ type: 'number' }])).toBe(12345);
    expect(validate('12345', { type: 'number' })).toBe(12345);
    expect(validate('12.34', { type: 'number' })).toBe(12.34);
    expect(validate(12.345, { type: 'number', digits: 2 })).toBe(12.35);
    expect(validate(12.344, { type: 'number', digits: 2 })).toBe(12.34);
    expect(validate(12.344, { type: 'number', digits: 2, roundingFn: 'ceil' })).toBe(12.35);
    expect(validate(12.345, { type: 'number', digits: 2, roundingFn: 'floor' })).toBe(12.34);
    expect(validate(12.345, { type: 'number', digits: 2, roundingFn: 'round' })).toBe(12.35);
    expect(validate(12.345, { type: 'number', digits: 2 })).toBe(12.35);
    expect(validate(1.23, { type: 'number', values: [1.23] })).toBe(1.23);
    expect(validate(10, { type: 'number', min: 9 })).toBe(10);
    expect(validate(10, { type: 'number', max: 11 })).toBe(10);
    expect(validate(10, { type: 'number', integer: true })).toBe(10);
    done();
  });

  it('should resolve all non-numbers', (done) => {
    expect(validate(undefined, { type: 'number', optional: true })).toBeUndefined();
    expect(validate(null, { type: 'number', optional: true })).toBeUndefined();
    expect(validate(null, { type: 'number', default: null })).toBeNull();
    expect(validate(NaN, { type: 'number', default: NaN })).toBeNaN();
    expect(validate(Infinity, { type: 'number', default: Infinity })).toBe(Infinity);

    const obj = { name: 'test' };
    expect(validate(obj, { type: 'number', default: () => ({ name: 'test' }) })).toBe(obj);
    done();
  });

  it('should reject all numbers', (done) => {
    expect(() => validate(NaN, [{ type: 'number' }])).toThrowError(ValidationError);
    expect(() => validate(NaN, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(Infinity, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(1.24, { type: 'number', values: [1.23] })).toThrowError(ValidationError);
    expect(() => validate(10, { type: 'number', max: 9 })).toThrowError(ValidationError);
    expect(() => validate(10, { type: 'number', min: 11 })).toThrowError(ValidationError);
    expect(() => validate(1.24, { type: 'number', integer: true })).toThrowError(ValidationError);
    done();
  });

  it('should reject all non-numbers', (done) => {
    expect(() => validate('12,34', { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(false, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(true, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(null, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(undefined, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(Error, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(Function, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(RegExp, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(() => {}, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(class {}, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate([], { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(['1', '2'], { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(['12'], { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(/asd/g, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate({ te: 'st' }, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate({}, { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(new Error(), { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(new Date(), { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(Symbol('test'), { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(Symbol(undefined), { type: 'number' })).toThrowError(ValidationError);
    expect(() => validate(undefined, { type: 'number', default: undefined })).toThrowError(ValidationError);
    done();
  });
});
