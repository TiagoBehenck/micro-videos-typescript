import { Category } from '../../domain/category.entity';
import { CategoryInMemoryRepository } from './category-in-memory.repository'

describe('Category In Memory Respository', () => { 
  let repository: CategoryInMemoryRepository;
   
  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  test('should no filter items when filter object is null', async () => { 
    const items = [Category.create({ name: 'Teste' })];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);

    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  })

  test('should filter items using filter parameter', async () => {
    const items = [
      Category.create({ name: 'Teste' }),
      Category.create({ name: 'Fake 01' }),
      Category.create({ name: 'Fake 02' }),
      Category.create({ name: 'Fake 03' }),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, 'Teste');

    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered.length).toBe(1);
    expect(itemsFiltered).toStrictEqual([items[0]]);
  })

  test('should sort by created_at when sort param is null', async () => { 
    const created_at = new Date();

    const items = [
      new Category({ name: 'Teste', created_at }),
      new Category({ name: 'Fake 01', created_at: new Date(created_at.getTime() + 100) }),
      new Category({ name: 'Fake 02', created_at: new Date(created_at.getTime() + 200) }),
      new Category({ name: 'Fake 03', created_at: new Date(created_at.getTime() + 300) }),
    ];

    const itemsFiltered = await repository['applySort'](items, null, null);

    expect(itemsFiltered).toStrictEqual([...items.reverse()]);
  })
})