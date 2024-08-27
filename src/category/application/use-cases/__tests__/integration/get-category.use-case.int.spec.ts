import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error"
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo"
import { setupSequelize } from "../../../../../shared/infra/testing/helpers"
import { Category } from "../../../../domain/category.entity"
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository"
import { CategoryModel } from "../../../../infra/db/sequelize/category.model"
import { UpdateCategoryUseCase } from "../../update-category.use-case"

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: UpdateCategoryUseCase
  let repository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] })

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel)
    useCase = new UpdateCategoryUseCase(repository)
  })

  it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  it('should get a category', async () => {
    const entity = Category.fake().aCategory().build();
    repository.insert(entity);

    let output = await useCase.execute({ id: entity.category_id.id })

    expect(output).toEqual({
      id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  })
})