/* eslint-disable @typescript-eslint/no-unsafe-return */
import { ValidationError, validate } from '../src';

describe('string', () => {
  it('should resolve all strings', (done) => {
    expect(validate('', { type: 'string' }, undefined, true)).toBe('');
    expect(validate('12345', { type: 'string' })).toBe('12345');
    expect(validate('12345', { type: 'string', length: 5 })).toBe('12345');
    expect(validate('12345', { type: 'string', max: 5 })).toBe('12345');
    expect(validate('12345', { type: 'string', max: 6 })).toBe('12345');
    expect(validate('12345', { type: 'string', min: 5 })).toBe('12345');
    expect(validate('12345', { type: 'string', min: 4 })).toBe('12345');
    expect(validate('12345', { type: 'string', min: 5, max: 5 })).toBe('12345');
    expect(validate('12345', { type: 'string', values: ['test', '12345'] })).toBe('12345');
    expect(validate('12345', { type: 'string', pattern: /^\d{5}$/ })).toBe('12345');
    expect(validate('12345', { type: 'string', pattern: '123' })).toBe('12345');
    expect(validate('12345', { type: 'string', pattern: ['^\\d{5}$'] })).toBe('12345');
    expect(validate('12345', { type: 'string', min: 6, default: '12345' })).toBe('12345');
    expect(validate('12345', { type: 'string', length: 4, default: '12345' })).toBe('12345');
    expect(validate('12345', { type: 'string', max: 4, default: '12345' })).toBe('12345');
    expect(validate('12345', { type: 'string', min: 6, max: 4, default: '12345' })).toBe('12345');
    expect(validate('12345', { type: 'string', values: ['test'], default: '12345' })).toBe('12345');
    expect(validate('12345', { type: 'string', pattern: /^\d{4}$/, default: '12345' })).toBe('12345');

    expect(validate('   \t\t \t12345 \n  ', { type: 'string', trim: true, length: 5 })).toBe('12345');
    expect(validate('   \t\t \t12345 \n  ', { type: 'string', trim: true, max: 5 })).toBe('12345');
    expect(validate('   \t\t \t12345 \n  ', { type: 'string', trim: true, max: 6 })).toBe('12345');
    expect(validate('   \t\t \t12345 \n  ', { type: 'string', trim: true, min: 5 })).toBe('12345');
    expect(validate('   \t\t \t12345 \n  ', { type: 'string', trim: true, min: 4 })).toBe('12345');
    expect(validate('   \t\t \t12345 \n  ', { type: 'string', trim: true, min: 5, max: 5 })).toBe('12345');
    expect(validate('   \t\t \t12345 \n  ', { type: 'string', trim: true, values: ['test', '12345'] })).toBe('12345');
    expect(validate('   \t\t \t12345 \n  ', { type: 'string', trim: true, pattern: /^\d{5}$/ })).toBe('12345');
    expect(validate(' \n  12345  12345  \t', { type: 'string', trim: true })).toBe('12345  12345');
    done();
  });

  it('should resolve all non-strings', (done) => {
    expect(validate(12345, { type: 'string' })).toBe('12345');
    expect(validate(undefined, { type: 'string', optional: true })).toBeUndefined();
    expect(validate(null, { type: 'string', optional: true })).toBeUndefined();
    expect(validate(null, { type: 'string', default: null })).toBeNull();
    expect(validate(NaN, { type: 'string', default: NaN })).toBeNaN();
    expect(validate(Infinity, { type: 'string', default: Infinity })).toBe(Infinity);

    const obj = { name: 'test' };
    expect(validate(obj, { type: 'string', default: () => ({ name: 'test' }) })).toBe(obj);
    done();
  });

  it('should reject all strings', (done) => {
    expect(() => validate('12345', { type: 'string', length: 4 })).toThrowError(ValidationError);
    expect(() => validate('12345', { type: 'string', min: 6 })).toThrowError(ValidationError);
    expect(() => validate('12345', { type: 'string', max: 4 })).toThrowError(ValidationError);
    expect(() => validate('12345', { type: 'string', min: 6, max: 4 })).toThrowError(ValidationError);
    expect(() => validate('12345', { type: 'string', values: ['test', '1234'] })).toThrowError(ValidationError);
    expect(() => validate('12345', { type: 'string', values: ['test'], default: '1234' })).toThrowError(ValidationError);
    expect(() => validate('12345', { type: 'string', pattern: /^\d{4}$/ })).toThrowError(ValidationError);
    expect(() => validate('12345', { type: 'string', pattern: ['^\\d{4}$'] })).toThrowError(ValidationError);
    done();
  });

  it('should reject all non-strings', (done) => {
    expect(() => validate(NaN, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(Infinity, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(false, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(true, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(null, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(null, { type: 'string', default: '' })).toThrowError(ValidationError);
    expect(() => validate(undefined, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(Error, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(Function, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(RegExp, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(() => {}, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(class {}, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate([], { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(['1', '2'], { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(['12'], { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(/asd/g, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate({ te: 'st' }, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate({}, { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(new Error(), { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(new Date(), { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(Symbol('test'), { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(Symbol(undefined), { type: 'string' })).toThrowError(ValidationError);
    expect(() => validate(undefined, { type: 'string', default: undefined })).toThrowError(ValidationError);
    done();
  });
});
