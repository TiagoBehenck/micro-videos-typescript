import { Entity } from '../../../../domain/entity';
import { NotFoundError } from '../../../../domain/errors/not-found.error';
import { Uuid } from '../../../../domain/value-objects/uuid.vo';
import { InMemoryRepository } from '../in-memory.repository';

type StubEntityConstructor = {
  entity_id?: Uuid;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: Uuid;
  name: string;
  price: number;

  constructor({ entity_id, name, price }: StubEntityConstructor) {
    super();
    this.entity_id = entity_id || new Uuid();
    this.name = name;
    this.price = price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id.id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, Uuid> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}

describe('InMemoryRepository Unit Tests', () => {
  let repo: StubInMemoryRepository;

  beforeEach(() => {
    repo = new StubInMemoryRepository();
  });

  test('should insert a new entity', async () => {
    const entity = new StubEntity({
      entity_id: new Uuid(),
      name: 'Movie',
      price: 99,
    });

    await repo.insert(entity);

    expect(repo.items.length).toBe(1);
    expect(repo.items[0]).toBe(entity);
  });

  test('should bulk insert entities', async () => {
    const entities = [
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Movie',
        price: 99,
      }),
      new StubEntity({
        entity_id: new Uuid(),
        name: 'Movie',
        price: 99,
      }),
    ];

    await repo.bulkInsert(entities);

    expect(repo.items.length).toBe(2);
    expect(repo.items[0]).toBe(entities[0]);
    expect(repo.items[1]).toBe(entities[1]);
  });

  test('should update an entity', async () => {
    const entity = new StubEntity({
      name: 'name',
      price: 100,
    });
    await repo.insert(entity);

    const otherEntity = new StubEntity({
      entity_id: entity.entity_id,
      name: 'update',
      price: 100,
    });
    await repo.update(otherEntity);

    expect(otherEntity.toJSON()).toStrictEqual(repo.items[0].toJSON());
  });

  test('should throws error on update when entity was not found', async () => {
    const entity = new StubEntity({
      name: 'name',
      price: 100,
    });

    await expect(repo.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity),
    );
  });

  test('should deletes an entity', async () => {
    const entity = new StubEntity({
      name: 'Movie',
      price: 99,
    });

    await repo.insert(entity);
    await repo.delete(entity.entity_id);

    expect(repo.items.length).toBe(0);
  });

  test('should throws error on delete when entity was not found', async () => {
    const uuid = new Uuid();
    await expect(repo.delete(uuid)).rejects.toThrow(
      new NotFoundError(uuid.id, StubEntity),
    );

    await expect(
      repo.delete(new Uuid('9366b7dc-2d71-4799-b91c-c64adb205104')),
    ).rejects.toThrow(
      new NotFoundError('9366b7dc-2d71-4799-b91c-c64adb205104', StubEntity),
    );
  });

  test('should find by id an entity', async () => {
    const entity = new StubEntity({
      name: 'name',
      price: 100,
    });

    await repo.insert(entity);
    const foundEntity = await repo.findById(entity.entity_id);

    expect(repo.items[0].toJSON()).toStrictEqual(foundEntity.toJSON());
  });

  test('should returns null when not found a entity by id', async () => {
    const foundEntity = await repo.findById(new Uuid());

    await expect(foundEntity).toBeNull();
  });

  test('should returns all entities', async () => {
    const entity = new StubEntity({
      name: 'name',
      price: 99,
    });
    await repo.insert(entity);

    const entities = await repo.findAll();

    expect(entities).toStrictEqual([entity]);
  });
});
