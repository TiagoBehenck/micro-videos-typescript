import { ValidationError } from 'class-validator';
import {
  UpdateCategoryInput,
  ValidateUpdateCategoryInput,
} from '../update-category.input';

describe('UpdateCategoryInput', () => {
  it('should update a valid instance with all properties', () => {
    const input = new UpdateCategoryInput({
      id: '1',
      name: 'test',
      description: 'test',
      is_active: true,
    });

    expect(input.id).toBe('1');
    expect(input.name).toBe('test');
    expect(input.description).toBe('test');
    expect(input.is_active).toBeTruthy();
  });

  it('should update a valid instance with only required properties', () => {
    const input = new UpdateCategoryInput({
      id: '1',
      name: 'test',
    });

    expect(input.id).toBe('1');
    expect(input.name).toBe('test');
  });

  it('should returns undefined error when the required properties doesnt have pass', () => {
    const input = new UpdateCategoryInput({} as any);

    expect(input.id).toBeUndefined();
  });
});

describe('ValidateUpdateCategoryInput', () => {
  it('should return no errors for valid input', () => {
    const input = new UpdateCategoryInput({
      id: '1',
      name: 'Test Category',
      description: 'Test Description',
      is_active: true,
    });

    const errors = ValidateUpdateCategoryInput.validate(input);
    expect(errors.length).toBe(0);
  });

  it('should return no errors for missing id', () => {
    const input = new UpdateCategoryInput({} as any);

    const errors = ValidateUpdateCategoryInput.validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toBeInstanceOf(ValidationError);
    expect(errors[0].property).toBe('id');
  });
});
