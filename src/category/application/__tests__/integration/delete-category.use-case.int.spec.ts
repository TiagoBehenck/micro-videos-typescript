import { set } from "lodash";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";

import { CategoryInMemoryRepository } from "../../../infra/db/category-in-memory.repository";
import { CategorySequelizeRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";

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