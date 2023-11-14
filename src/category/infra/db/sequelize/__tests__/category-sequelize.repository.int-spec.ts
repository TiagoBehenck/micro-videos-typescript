import { Sequelize } from 'sequelize-typescript'
import { CategoryModel } from '../category.model'
import { CategorySequelizeRepository } from '../category-sequelize.repository'
import { Category } from '../../../../domain/category.entity'

describe('Category Sequelize Respository Integration Test', () => { 
  let sequelize
  let respository: CategorySequelizeRepository

  beforeEach(async () => { 
    sequelize = new Sequelize({
      dialect: 'sqlite',
      storage: ':memory:',
      models: [CategoryModel]
    });

    await sequelize.sync({ force: true });
    respository = new CategorySequelizeRepository(CategoryModel);
  })

  test('should insert a new category', async () => { 
    const category = Category.fake().aCategory().build();
    await respository.insert(category);

    const model = CategoryModel.findByPk(category.category_id.id);

    expect(model.toJSON()).toMatchObject({
      category_id: category.category_id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    })
  })
})