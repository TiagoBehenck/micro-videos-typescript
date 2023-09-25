import { Entity } from '../../../../domain/entity';
import { Uuid } from '../../../../domain/value-objects/uuid.vo';
import { InMemoryRepository, InMemorySearchableRepository } from '../in-memory.repository';

type StubEntityConstructorProps = { 
  entity_id?: Uuid;
  name: string;
  price: number;
}

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor({ entity_id, name, price }: StubEntityConstructorProps) { 
    super();
    this.entity_id = entity_id || new Uuid();
    this.name = name;
    this.price = price;
  }

  toJSON(): { id: string } & StubEntityConstructorProps { 
    return { 
      id: this.entity_id.id,
      name: this.name,
      price: this.price
    }
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity
  }
}

class StubInMemorySearchableRepository extends InMemorySearchableRepository<
  StubEntity,
  Uuid
> { 
  sortableFields: string[] = ['name'];

  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }

  protected async applyFilter(items: StubEntity[], filter: string): Promise<StubEntity[]> {
    if (!filter) return items

    return items.filter((i) => { 
      return (
        i.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase()) ||
        i.price.toString() === filter
      );
    });
  }
}

describe('InMemorySearchableRepository Unit Tests', () => { 
  let repo: StubInMemorySearchableRepository;

  beforeEach(() => (repo = new StubInMemorySearchableRepository()));

  describe('applyFilter method', () => { 
    test('should no filter items when filter param is null', async () => { 
      const items =[ new StubEntity({ name: 'Test', price: 99 }) ];
      const spyFilterMethod = jest.spyOn(items, 'filter' as any);
      const itemsFiltered = await repo['applyFilter'](items, null);
  
      expect(itemsFiltered).toStrictEqual(items);
      expect(spyFilterMethod).not.toHaveBeenCalled();
    })

    test('should filter using a filter param',async () => {
      const items = [
        new StubEntity({ name: 'test', price: 5 }),
        new StubEntity({ name: 'TEST', price: 5 }),
        new StubEntity({ name: 'fake', price: 0 }), 
      ];
      const spyFilterMethod = jest.spyOn(items, 'filter' as any);
      let itemsFiltered = await repo['applyFilter'](items, 'test');

      expect(itemsFiltered).toStrictEqual([items[0], items[1]])
      expect(itemsFiltered.length).toBe(2);
      expect(spyFilterMethod).toHaveBeenCalledTimes(1);

      itemsFiltered = await repo['applyFilter'](items, 'fake');
      
      expect(itemsFiltered).toStrictEqual([items[2]])
      expect(itemsFiltered.length).toBe(1);
      expect(spyFilterMethod).toHaveBeenCalledTimes(2);

      itemsFiltered = await repo['applyFilter'](items, 'no-filter');
      expect(itemsFiltered).toStrictEqual([]);
      expect(itemsFiltered.length).toBe(0);
      expect(spyFilterMethod).toHaveBeenCalledTimes(3);
    })
  })

  describe('applySort method', () => { 
    test('should no sort items', async () => { 
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'a', price: 5 }),
      ];

      let itemsSorted = await repo['applySort'](items, null, null);
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repo['applySort'](items, 'price', 'asc');
      expect(itemsSorted).toStrictEqual(items);

      itemsSorted = await repo['applySort'](items, 'price', 'asc');
      expect(itemsSorted).toStrictEqual(items);
    })

    test('should sort items', async () => { 
      const items = [
        new StubEntity({ name: 'b', price: 5 }),  // 0
        new StubEntity({ name: 'f', price: 7 }),  // 1
        new StubEntity({ name: 'a', price: 10 }), // 2
      ];

      let itemsSorted = await repo['applySort'](items, 'name', 'asc');
      expect(itemsSorted).toStrictEqual([
        items[2],
        items[0],
        items[1],
      ]);

      itemsSorted = await repo['applySort'](items, 'name', 'desc');
      expect(itemsSorted).toStrictEqual([
        items[1],
        items[0],
        items[2],
      ]);

    })
  })

  describe('applyPaginate method', () => { 
    test('should paginate items', async () => {
      const items = [
        new StubEntity({ name: 'b', price: 5 }),
        new StubEntity({ name: 'f', price: 7 }),
        new StubEntity({ name: 'a', price: 10 }),
        new StubEntity({ name: 'g', price: 15 }),
        new StubEntity({ name: 'h', price: 25 }),
        new StubEntity({ name: 't', price: 33 }),
      ];

      let paginateItems = await repo['applyPaginate'](items, 1, 3);
      expect(paginateItems).toStrictEqual(items.slice(0, 3));
      expect(paginateItems).toStrictEqual([
        items[0],
        items[1],
        items[2],
      ]);

       paginateItems = await repo['applyPaginate'](items, 1, 4);
      expect(paginateItems).toStrictEqual(items.slice(0, 4));
      expect(paginateItems).toStrictEqual([
        items[0],
        items[1],
        items[2],
        items[3],
      ]);

      paginateItems = await repo['applyPaginate'](items, 2, 3);
      expect(paginateItems).toStrictEqual(items.slice(3, 6));
      expect(paginateItems).toStrictEqual([
        items[3],
        items[4],
        items[5],
      ]);

      paginateItems = await repo['applyPaginate'](items, 2, 5);
      expect(paginateItems).toStrictEqual(items.slice(5, 6));
      expect(paginateItems).toStrictEqual([
        items[5],
      ])

      paginateItems = await repo['applyPaginate'](items, 2, 6);
      expect(paginateItems).toStrictEqual([])
    })
  })

  describe('search method', () => { 
    test('should apply only paginate when other param are null', async () => { 
      
    })
    
  })
})