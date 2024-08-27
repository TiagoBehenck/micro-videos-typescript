import { IUseCase } from "../../shared/application/use-case.interface";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { ICategoryRepository } from "../domain/category.repository";

export type DeleteCategoryInput = {
  id: string;
}

export class DeleteCategoryUseCase implements IUseCase<DeleteCategoryInput, void> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<void> {
    const uuid = new Uuid(input.id);

    await this.categoryRepository.delete(uuid);
  }
}