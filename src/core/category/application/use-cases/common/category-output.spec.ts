import { Category } from "../../../domain/category.entity";
import { CategoryOutputMapper } from "./category-output";

describe('CategoryOutputMapper Unit Tests', () => {
  it('should convert a category to output', () => {
    const entity = Category.create({
      name: 'test 1',
      description: 'test description',
      is_active: true,
    })

    const spyToJSON = jest.spyOn(entity, 'toJSON');
    const output = CategoryOutputMapper.toOutput(entity);

    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'test 1',
      description: 'test description',
      is_active: true,
      created_at: entity.created_at,
    })
  })
});