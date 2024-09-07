import { ValidationError } from 'class-validator';
import {
  CreateCategoryInput,
  ValidateCreateCategoryInput,
} from '../create-category.input';

describe('CreateCategoryInput', () => {
  it('should create a valid instance with all properties', () => {
    const input = new CreateCategoryInput({
      name: 'Test Category',
      description: 'Test Description',
      is_active: true,
    });

    expect(input.name).toBe('Test Category');
    expect(input.description).toBe('Test Description');
    expect(input.is_active).toBe(true);
  });

  it('should create a valid instance with only required properties', () => {
    const input = new CreateCategoryInput({
      name: 'Test Category',
    });

    expect(input.name).toBe('Test Category');
    expect(input.description).toBeUndefined();
    expect(input.is_active).toBeUndefined();
  });

  it('should create an empty instance if no props are provided', () => {
    const input = new CreateCategoryInput({} as any);

    expect(input.name).toBeUndefined();
    expect(input.description).toBeUndefined();
    expect(input.is_active).toBeUndefined();
  });
});

describe('ValidateCreateCategoryInput', () => {
  it('should return no errors for valid input', () => {
    const input = new CreateCategoryInput({
      name: 'Test Category',
      description: 'Test Description',
      is_active: true,
    });

    const errors = ValidateCreateCategoryInput.validate(input);
    expect(errors.length).toBe(0);
  });

  it('should return error for missing name', () => {
    const input = new CreateCategoryInput({} as any);

    const errors = ValidateCreateCategoryInput.validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toBeInstanceOf(ValidationError);
    expect(errors[0].property).toBe('name');
  });

  it('should return no errors for valid input with only required properties', () => {
    const input = new CreateCategoryInput({
      name: 'Test Category',
    });

    const errors = ValidateCreateCategoryInput.validate(input);
    expect(errors.length).toBe(0);
  });

  it('should return error for invalid type of is_active', () => {
    const input = new CreateCategoryInput({
      name: 'Test Category',
      is_active: 'true' as any, // invalid type
    });

    const errors = ValidateCreateCategoryInput.validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toBeInstanceOf(ValidationError);
    expect(errors[0].property).toBe('is_active');
  });

  it('should return error for invalid type of description', () => {
    const input = new CreateCategoryInput({
      name: 'Test Category',
      description: 123 as any, // invalid type
    });

    const errors = ValidateCreateCategoryInput.validate(input);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0]).toBeInstanceOf(ValidationError);
    expect(errors[0].property).toBe('description');
  });
});
