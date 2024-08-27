import { IUseCase } from "../../../shared/application/use-case.interface";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import { Uuid } from "../../../shared/domain/value-objects/uuid.vo";
import { Category } from "../../domain/category.entity";
import { ICategoryRepository } from "../../domain/category.repository";
import { CategoryOutput, CategoryOutputMapper } from "./common/category-output";

export type GetCategoryUseCaseInput = {
  id: string;
}

export type GetCategoryUseCaseOutput = CategoryOutput;

export class GetCategoryUseCase implements IUseCase<GetCategoryUseCaseInput, GetCategoryUseCaseOutput> {
  constructor(private readonly categoryRepository: ICategoryRepository) {}
  
  async execute(input: GetCategoryUseCaseInput): Promise<GetCategoryUseCaseOutput> {
    const category = await this.categoryRepository.findById(new Uuid(input.id));

    if (!category) throw new NotFoundError(input.id, Category);

    return CategoryOutputMapper.toOutput(category);
  }
}