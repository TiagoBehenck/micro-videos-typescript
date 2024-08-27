import { ICategoryRepository } from "../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../infra/db/category-in-memory.repository";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe('CreateCategoryUseCase Unit Tests', () => {
  let useCase: CreateCategoryUseCase;
  let categoryRepository: ICategoryRepository;

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(categoryRepository);
  });

  it('should create a new category', async () => {
    const spyInsert = jest.spyOn(categoryRepository, 'insert');
    const input = {
      name: 'Category 1',
      description: 'Category 1 description',
      is_active: true
    };

    let output = await useCase.execute(input);
    
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      id: expect.any(String),
      name: input.name,
      description: input.description,
      is_active: input.is_active,
      created_at: expect.any(Date)
    });

    output = await useCase.execute({
        name: 'Category 2',
        description: 'Category 2 description',
        is_active: false
      });
    
    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toEqual({
      id: expect.any(String),
      name: 'Category 2',
      description: 'Category 2 description',
      is_active: false,
      created_at: expect.any(Date)
    });
  });
});