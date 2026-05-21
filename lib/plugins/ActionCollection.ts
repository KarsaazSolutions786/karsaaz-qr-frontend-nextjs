type ActionCallback = {
  callback: (...args: unknown[]) => unknown;
  sortOrder: number;
};

/**
 * Purpose: Class definition for ActionCollection.
 * Owner/Author: Syed Ashhad
 * Created/Updated: February 2026
 */
export class ActionCollection {
  private store = new Map<string, ActionCallback[]>();

  /**
   * Purpose: Retrieves actions.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  private getActions(actionName: string): ActionCallback[] {
    if (!this.store.has(actionName)) {
      this.store.set(actionName, []);
    }
    return this.store.get(actionName)!;
  }

  /**
   * Purpose: Executes addAction functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  addAction(
    actionName: string,
    callback: (...args: unknown[]) => unknown,
    sortOrder = 0
  ): void {
    const actions = this.getActions(actionName);
    actions.push({ callback, sortOrder });
    actions.sort((a, b) => a.sortOrder - b.sortOrder);
  }

  /**
   * Purpose: Executes doActions functionality.
   * Owner/Author: Syed Ashhad
   * Created/Updated: February 2026
   */
  doActions(actionName: string, ...params: unknown[]): unknown[] {
    const actions = this.getActions(actionName);
    return actions.map((action) => action.callback(...params));
  }
}
