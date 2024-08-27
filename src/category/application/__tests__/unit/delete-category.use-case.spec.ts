import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { InvalidUuidError, Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../../domain/category.entity";

import { CategoryInMemoryRepository } from "../../../infra/db/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../../delete-category.use-case";

describe('DeleteCategoryUseCase Unit Tests', () => {
  let useCase: DeleteCategoryUseCase
  let categoryRepository: CategoryInMemoryRepository

  beforeEach(() => {
    categoryRepository = new CategoryInMemoryRepository()
    useCase = new DeleteCategoryUseCase(categoryRepository)
  })

   it('should throws error when entity not found', async () => {
    await expect(() => 
      useCase.execute({ id: 'fake' })
    ).rejects.toThrow(new InvalidUuidError());

    const uuid = new Uuid();
    await expect(() => 
      useCase.execute({ id: uuid.id })
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  })

  it("should delete a category", async () => {
    const items = [new Category({ name: "test 1" })];
    categoryRepository.items = items;
    await useCase.execute({
      id: items[0].category_id.id,
    });
    expect(categoryRepository.items).toHaveLength(0);
  });
});