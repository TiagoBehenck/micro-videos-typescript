import { Uuid } from "../../../../shared/domain/value-objects/uuid.vo";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { CategorySequelizeRepository } from "../../../infra/db/sequelize/category-sequelize.repository";
import { CategoryModel } from "../../../infra/db/sequelize/category.model";
import { CreateCategoryUseCase } from "../../create-category.use-case";

describe('CreateCategoryUseCase Integration Tests', () => {
  let useCase: CreateCategoryUseCase;
  let categoryRepository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    categoryRepository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(categoryRepository);
  });

  it('should create a new category', async () => {
    let output = await useCase.execute({ name: 'Category 1' });
    let entity = await categoryRepository.findById(new Uuid(output.id));
    
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Category 1',
      description: null,
      is_active: true,
      created_at: entity.created_at
    })

    output = await useCase.execute({
      name: 'Category 2',
      description: 'Category 2 description',
      is_active: false
    })

    entity = await categoryRepository.findById(new Uuid(output.id));
    expect(output).toStrictEqual({
      id: entity.category_id.id,
      name: 'Category 2',
      description: 'Category 2 description',
      is_active: false,
      created_at: entity.created_at
    })
  });
});