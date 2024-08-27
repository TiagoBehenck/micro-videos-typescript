import { NotFoundError } from "../../../../shared/domain/errors/not-found.error"
import { InvalidUuidError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo"
import { Category } from "../../../domain/category.entity"
import { ICategoryRepository } from "../../../domain/category.repository"
import { CategoryInMemoryRepository } from "../../../infra/db/category-in-memory.repository"
import { UpdateCategoryUseCase } from "../../update-category.use-case"

describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCategoryUseCase
  let categoryRepository: ICategoryRepository

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository()
    useCase = new UpdateCategoryUseCase(categoryRepository)
  })

  it('should throws error when entity not found', async () => {
    await expect(() => 
      useCase.execute({ id: 'fake', name: 'fake' })
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();
    await expect(() => 
      useCase.execute({ id: uuid.id, name: 'fake' })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  })

  it('should update a category', async () => {
    const spyUpdate = jest.spyOn(categoryRepository, 'update');
    const entity = Category.fake().aCategory().build();
    categoryRepository.insert(entity);

    const updatedEntity = await useCase.execute({ id: entity.category_id.id, name: 'Updated Category' });
    
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(updatedEntity.id).toBe(entity.category_id.id);
    expect(updatedEntity.name).toBe('Updated Category');
  })
})