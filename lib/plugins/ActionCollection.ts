type ActionCallback = {
  callback: (...args: unknown[]) => unknown;
  sortOrder: number;
};

export class ActionCollection {
  private store = new Map<string, ActionCallback[]>();

  private getActions(actionName: string): ActionCallback[] {
    if (!this.store.has(actionName)) {
      this.store.set(actionName, []);
    }
    return this.store.get(actionName)!;
  }

  addAction(
    actionName: string,
    callback: (...args: unknown[]) => unknown,
    sortOrder = 0
  ): void {
    const actions = this.getActions(actionName);
    actions.push({ callback, sortOrder });
    actions.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  doActions(actionName: string, ...params: unknown[]): unknown[] {
    const actions = this.getActions(actionName);
    return actions.map((action) => action.callback(...params));
  }
}
