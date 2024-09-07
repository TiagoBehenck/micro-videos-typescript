import { Category } from '../../../domain/category.entity';
import { CategoryInMemoryRepository } from './category-in-memory.repository';

describe('Category In Memory Respository', () => {
  let repository: CategoryInMemoryRepository;

  beforeEach(() => (repository = new CategoryInMemoryRepository()));

  it('should no filter items when filter object is null', async () => {
    const items = [Category.fake().aCategory().build()];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, null);

    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it('should filter items using filter parameter', async () => {
    const items = [
      Category.fake().aCategory().withName('Teste').build(),
      Category.fake().aCategory().withName('Fake 01').build(),
      Category.fake().aCategory().withName('Fake 02').build(),
      Category.fake().aCategory().withName('Fake 03').build(),
    ];
    const filterSpy = jest.spyOn(items, 'filter' as any);

    const itemsFiltered = await repository['applyFilter'](items, 'Teste');

    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered.length).toBe(1);
    expect(itemsFiltered).toStrictEqual([items[0]]);
  });

  it('should sort by created_at when sort param is null', async () => {
    const created_at = new Date();

    const items = [
      Category.fake()
        .aCategory()
        .withName('Teste')
        .withCreatedAt(created_at)
        .build(),
      Category.fake()
        .aCategory()
        .withName('Fake 01')
        .withCreatedAt(new Date(created_at.getTime() + 100))
        .build(),
      Category.fake()
        .aCategory()
        .withName('Fake 02')
        .withCreatedAt(new Date(created_at.getTime() + 200))
        .build(),
      Category.fake()
        .aCategory()
        .withName('Fake 03')
        .withCreatedAt(new Date(created_at.getTime() + 300))
        .build(),
    ];

    const itemsFiltered = await repository['applySort'](items, null, null);

    expect(itemsFiltered).toStrictEqual([...items.reverse()]);
  });

  it('should short by name', async () => {
    const items = [
      Category.fake().aCategory().withName('c').build(),
      Category.fake().aCategory().withName('b').build(),
      Category.fake().aCategory().withName('a').build(),
    ];

    let itemsSorted = await repository['applySort'](items, 'name', 'asc');
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository['applySort'](items, 'name', 'desc');
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });
});
