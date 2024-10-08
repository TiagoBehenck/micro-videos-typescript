import { SortDirection } from '../../../../shared/domain/repository/search-params';
import { Uuid } from '../../../../shared/domain/value-objects/uuid.vo';
import { InMemorySearchableRepository } from '../../../../shared/infra/db/in-memory/in-memory.repository';
import { Category } from '../../../domain/category.entity';
import { CategoryFilter, ICategoryRepository } from '../../../domain/category.repository';

export class CategoryInMemoryRepository 
  extends InMemorySearchableRepository<Category, Uuid> 
  implements ICategoryRepository {
 
  sortableFields: string[] = ['name', 'created_at'];

  protected async applyFilter(
      items: Category[],
      filter: CategoryFilter,
    ): Promise<Category[]> {
    
    if (!filter) return items

    return items.filter((i) => {
      return (
        i.name.toLocaleLowerCase().includes(filter.toLocaleLowerCase())
      );
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
  
  protected applySort(
    items: Category[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: string, item: Category) => any,
  ) {
    return sort 
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, 'created_at', 'desc')
  }
}