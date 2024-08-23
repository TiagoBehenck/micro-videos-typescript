import { CategoryModel } from '../category.model'
import { CategoryModelMapper } from '../category-model-mapper'
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error'
import { Category } from '../../../../domain/category.entity'
import { Uuid } from '../../../../../shared/domain/value-objects/uuid.vo'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'

describe('Category Model Mapper Integration it', () => { 
  setupSequelize({ models: [CategoryModel] })

  test('should throws error when category is invalid', async () => { 
    const model = CategoryModel.build({
      category_id: '35d12ea6-6d18-49a9-9842-c54748e610e2',
    })

    try { 
      CategoryModelMapper.toEntity(model);
      fail('The category is valid, but it needs throws a EntityValidationError');
    } catch(e) { 
      expect(e).toBeInstanceOf(EntityValidationError);
      expect((e as EntityValidationError).error).toMatchObject(
        {
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters"
          ],
        }
      )
    }
  })

  test('should convert a category aggregate to a category model', () => { 
    const created_at = new Date();
    const aggregate = new Category({ 
      category_id: new Uuid('35d12ea6-6d18-49a9-9842-c54748e610e2'),
      name: 'some name',
      description: 'some description',
      is_active: true,
      created_at,
    })

    const model = CategoryModelMapper.toModel(aggregate);

    expect(model.toJSON()).toStrictEqual({ 
      category_id: '35d12ea6-6d18-49a9-9842-c54748e610e2',
      name: 'some name',
      description: 'some description',
      is_active: true,
      created_at,
    })
  })
})  