/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ValidationError, validate } from '../src';

describe('date', () => {
  it('should resolve all dates', (done) => {
    expect(validate('1997-07-15', { type: 'date' })).toBeInstanceOf(Date);
    expect(validate(Date.now(), { type: 'date' })).toBeInstanceOf(Date);
    expect(validate(new Date(), { type: 'date' })).toBeInstanceOf(Date);
    expect(validate('2020-10-01T00:00:00.000Z', { type: 'date' })).toBeInstanceOf(Date);
    expect(validate('2020-10-01T00:00:00Z', { type: 'date' })).toBeInstanceOf(Date);
    expect(validate('2020-10-01T00:00:00+0300', { type: 'date' })).toBeInstanceOf(Date);

    const date = new Date();
    date.setSeconds(date.getSeconds() + 5);
    expect(validate(date, { type: 'date', min: Date.now() })).toBeInstanceOf(Date);
    expect(validate(date, { type: 'date', min: () => new Date() })).toBeInstanceOf(Date);
    expect(validate(date, { type: 'date', min: () => Date.now() })).toBeInstanceOf(Date);

    date.setSeconds(date.getSeconds() - 10);
    expect(validate(date, { type: 'date', max: Date.now() })).toBeInstanceOf(Date);
    expect(validate(date, { type: 'date', max: () => new Date() })).toBeInstanceOf(Date);
    expect(validate(date, { type: 'date', max: () => Date.now() })).toBeInstanceOf(Date);
    done();
  });

  it('should resolve all non-dates', (done) => {
    expect(validate(undefined, { type: 'date', optional: true })).toBeUndefined();
    expect(validate(null, { type: 'date', optional: true })).toBeUndefined();
    expect(validate(null, { type: 'date', default: null })).toBeNull();
    expect(validate(undefined, { type: 'date', default: () => Date.now() })).toBeLessThanOrEqual(Date.now());
    expect(validate(NaN, { type: 'date', default: NaN })).toBeNaN();
    expect(validate(Infinity, { type: 'date', default: Infinity })).toBe(Infinity);

    const obj = { name: 'test' };
    expect(validate(obj, { type: 'date', default: () => ({ name: 'test' }) })).toBe(obj);
    done();
  });

  it('should reject all dates', (done) => {
    expect(() => validate(Date.now() - 1000, { type: 'date', min: Date.now() })).toThrowError(ValidationError);
    done();
  });

  it('should reject all non-dates', (done) => {
    expect(() => validate(NaN, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(Infinity, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate('12,34', { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(null, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(undefined, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(Error, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(Function, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(RegExp, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(() => {}, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(class {}, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate([], { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(['1', '2'], { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(['12'], { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(/asd/g, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate({ te: 'st' }, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate({}, { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(new Error(), { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(Symbol('test'), { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(Symbol(undefined), { type: 'date' })).toThrowError(ValidationError);
    expect(() => validate(undefined, { type: 'date', default: undefined })).toThrowError(ValidationError);
    done();
  });
});
