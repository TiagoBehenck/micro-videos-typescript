import { CategoryModel } from '../category.model'
import { CategorySequelizeRepository } from '../category-sequelize.repository'
import { Category } from '../../../../domain/category.entity'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { NotFoundError } from '../../../../../shared/domain/errors/not-found.error'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'

describe('Category Sequelize Repository Integration it', () => { 
  let repository: CategorySequelizeRepository
  setupSequelize({ models: [CategoryModel] })

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  })

  it('should insert a new entity', async () => { 
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    const model = await CategoryModel.findByPk(entity.category_id.id);

    expect(model.toJSON()).toMatchObject({
      category_id: entity.category_id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    })
  })

  it('should finds a entity by id', async () => { 
     let entityFound = await repository.findById(new Uuid());
    expect(entityFound).toBeNull();

    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);
    entityFound = await repository.findById(entity.category_id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  })

  it('should return all categories', async () => { 
    const entity = Category.fake().theCategories(10).build();
    await repository.bulkInsert(entity);

    const entities = await CategoryModel.findAll()

    expect(entities.length).toBe(entity.length);
    expect(JSON.stringify(entities)).toBe(JSON.stringify(entity))
  })

  it('should throw error on update when a entity not found', async () => { 
    const entity = Category.fake().aCategory().build();
    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.category_id.id, Category)
    );
  })

  it('should update a entity', async () => {
const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    entity.changeName("Movie updated");
    await repository.update(entity);

    const entityFound = await repository.findById(entity.category_id);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  })

  it('should throw error on delete when a entity not found', async () => { 
    const entity = Category.fake().aCategory().build();
    await expect(repository.delete(entity.category_id)).rejects.toThrow(
      new NotFoundError(entity.category_id.id, Category)
    );
  })

  it('should delete a entity', async () => { 
    const entity = Category.fake().aCategory().build();
    await repository.insert(entity);

    await repository.delete(entity.category_id);

    const entityFound = await repository.findById(entity.category_id);
    expect(entityFound).toBeNull();
  })
})  