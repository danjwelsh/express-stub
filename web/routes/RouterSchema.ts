/**
 * Router Schema
 *
 * Describes a router schema
 */
export default class RouterSchema {
  // Route options for middleware injection
  private options: { isOwned: boolean; isProtected: boolean };

  private route: string;
  private table: string;

  /**
   * Create an instance of RouterSchema
   *
   * @param {{isOwned: boolean; isProtected: boolean}} options
   * @param {string} route
   * @param {string} table
   */
  constructor(
    options: { isOwned: boolean; isProtected: boolean },
    route: string,
    table: string
  ) {
    this.options = options;
    this.route = route;
    this.table = table;
  }

  // getters setters
  public getOptions(): { isOwned: boolean; isProtected: boolean } {
    return this.options;
  }

  public setOptions(value: { isOwned: boolean; isProtected: boolean }) {
    this.options = value;
  }

  public getRoute(): string {
    return this.route;
  }

  public setRoute(value: string) {
    this.route = value;
  }

  public getTable(): string {
    return this.table;
  }

  public setTable(value: string) {
    this.table = value;
  }
}
