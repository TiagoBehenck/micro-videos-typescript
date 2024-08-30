import { validate as uuidValidate } from 'uuid';
import { InvalidUuidError, Uuid } from '../uuid.vo';

describe('Uuid Unit Tests', () => {
  const validateSpy = jest.spyOn(Uuid.prototype as any, 'validate');

  test('should throw error when uuid is invalid', () => {
    expect(() => {
      new Uuid('invalid-uuid');
    }).toThrowError(new InvalidUuidError());
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should create a valid uuid', () => {
    const uuid = new Uuid();
    expect(uuid.id).toBeDefined();
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test('should accept a valid uuid', () => {
    const validUuid = '1346f9cf-c6f5-47be-b732-d01a0b255f9f';
    const uuid = new Uuid(validUuid);
    expect(uuid.id).toBe(validUuid);
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
