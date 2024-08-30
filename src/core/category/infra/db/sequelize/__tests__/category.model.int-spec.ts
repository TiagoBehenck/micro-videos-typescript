import { DataType } from 'sequelize-typescript'
import { CategoryModel } from '../category.model'
import { setupSequelize } from '../../../../../shared/infra/testing/helpers'

describe('CategoryModel Integration Tests', () => { 
  setupSequelize({ models: [CategoryModel] })

  test('mapping props', () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());
    
    expect(attributes).toStrictEqual([
      "category_id",
      "name",
      "description",
      "is_active",
      "created_at",
    ])

    const categoryIdAttr = attributesMap.category_id;
    expect(categoryIdAttr).toMatchObject({
      primaryKey: true,
      fieldName: 'category_id',
      field: 'category_id',
      type: DataType.UUID(),
    })

    const nameAttr = attributesMap.name;
    expect(nameAttr).toMatchObject({
      allowNull: false,
      fieldName: 'name',
      field: 'name',
      type: DataType.STRING(255),
    })

    const descriptionAttr = attributesMap.description;
    expect(descriptionAttr).toMatchObject({
      allowNull: true,
      fieldName: 'description',
      field: 'description',
      type: DataType.TEXT(),
    })

    const isActiveAttr = attributesMap.is_active;
    expect(isActiveAttr).toMatchObject({
      allowNull: false,
      fieldName: 'is_active',
      field: 'is_active',
      type: DataType.BOOLEAN(),
    })

    const createdAttiveAttr = attributesMap.created_at;
    expect(createdAttiveAttr).toMatchObject({
      allowNull: false,
      fieldName: 'created_at',
      field: 'created_at',
      type: DataType.DATE(3),
    })
  })

  test('create', async () => { 
    const arrange = {
      category_id: '46f64908-f7df-4838-9b82-cdf0ee8b1248',
      name: 'test',
      is_active: true,
      created_at: new Date(),
    }

    const category = await CategoryModel.create(arrange);
    expect(category.toJSON()).toStrictEqual(arrange);
  })
})