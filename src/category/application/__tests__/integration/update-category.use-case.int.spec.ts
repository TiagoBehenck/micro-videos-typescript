import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { Category } from "../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { UpdateCategoryUseCase } from "../../update-category.use-case";

describe('UpdateCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let categoryRepository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new UpdateCategoryUseCase(categoryRepository);
  });
  
  it('should throws error when entity not found', async () => {
    await expect(() => 
        useCase.execute({ id: 'fake', name: 'fake' })
      ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();
    await expect(() => 
      useCase.execute({ id: uuid.id, name: 'fake' })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it('should update a category', async () => {
    const entity = Category.fake().aCategory().build();
    categoryRepository.insert(entity);

    const updatedEntity = await useCase.execute({ id: entity.category_id.id, name: 'Updated Category' });
    
    expect(updatedEntity.id).toBe(entity.category_id.id);
    expect(updatedEntity.name).toBe('Updated Category');
  });
});