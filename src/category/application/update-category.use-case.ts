import { IUseCase } from "../../shared/application/use-case.interface";
import { NotFoundError } from "../../shared/domain/errors/not-found.error";
import { Uuid } from "../../shared/domain/value-objects/uuid.vo";
import { Category } from "../domain/category.entity";
import { ICategoryRepository } from "../domain/category.repository";

export type CreateCategoryInput = {
  id: string;
  name?: string;
  description?: string | null;
  is_active?: boolean;
}
  
export type CreateCategoryOutput = {
  id: string;
  name: string;
  description: string;
  is_active: boolean;
  created_at: Date;
}
export class UpdateCategoryUseCase implements IUseCase<CreateCategoryInput, CreateCategoryOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = await this.categoryRepository.findById(new Uuid(input.id));

    if (!category) throw new NotFoundError(input.id, Category);

    if (input.name) category.changeName(input.name);
    if ('description' in input) category.changeDescription(input.description);
    if (input.is_active) category.activate();
    if (input.is_active === false) category.deactivate();


    await this.categoryRepository.update(category);

    return {
      id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at
    }
  }
}