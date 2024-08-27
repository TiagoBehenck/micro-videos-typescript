import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { Category } from "../../../../domain/category.entity";
import { CategorySequelizeRepository } from "../../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../../infra/db/sequelize/category.model";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";

describe('DeleteCategoryUseCase Unit Tests', () => {
  let useCase: DeleteCategoryUseCase
  let categoryRepository: CategorySequelizeRepository

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel)
    useCase = new DeleteCategoryUseCase(categoryRepository)
  })

   it('should throws error when entity not found', async () => {
    const uuid = new Uuid();
    await expect(() => 
      useCase.execute({ id: uuid.id })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  })

  it("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await categoryRepository.insert(category);
    await useCase.execute({ id: category.category_id.id });

    await expect(categoryRepository.findById(category.category_id)).resolves.toBeNull();
  });
});