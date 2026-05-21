type FilterCallback = {
  callback: (value: unknown, ...rest: unknown[]) => unknown;
  sortOrder: number;
};

/**
 * Purpose: Class definition for FilterCollection.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export class FilterCollection {
  private store = new Map<string, FilterCallback[]>();

  /**
   * Purpose: Retrieves filters.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  private getFilters(filterName: string): FilterCallback[] {
    if (!this.store.has(filterName)) {
      this.store.set(filterName, []);
    }
    return this.store.get(filterName)!;
  }

  /**
   * Purpose: Executes addFilter functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  addFilter(
    filterName: string,
    callback: (value: unknown, ...rest: unknown[]) => unknown,
    sortOrder = 0
  ): void {
    const filters = this.getFilters(filterName);
    filters.push({ callback, sortOrder });
    filters.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  /**
   * Purpose: Executes applyFilters functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  applyFilters<T>(filterName: string, value: T, ...params: unknown[]): T {
    const filters = this.getFilters(filterName);
    return filters.reduce<T>(
      (acc, filter) => filter.callback(acc, ...params) as T,
      value
    );
  }
}
