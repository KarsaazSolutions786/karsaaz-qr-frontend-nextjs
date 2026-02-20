type FilterCallback = {
  callback: (value: unknown, ...rest: unknown[]) => unknown;
  sortOrder: number;
};

export class FilterCollection {
  private store = new Map<string, FilterCallback[]>();

  private getFilters(filterName: string): FilterCallback[] {
    if (!this.store.has(filterName)) {
      this.store.set(filterName, []);
    }
    return this.store.get(filterName)!;
  }

  addFilter(
    filterName: string,
    callback: (value: unknown, ...rest: unknown[]) => unknown,
    sortOrder = 0
  ): void {
    const filters = this.getFilters(filterName);
    filters.push({ callback, sortOrder });
    filters.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  applyFilters<T>(filterName: string, value: T, ...params: unknown[]): T {
    const filters = this.getFilters(filterName);
    return filters.reduce<T>(
      (acc, filter) => filter.callback(acc, ...params) as T,
      value
    );
  }
}
