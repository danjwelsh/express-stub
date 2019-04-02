import {DBType} from "./DBType";

export default class Context {
  private _dbType: DBType;

  constructor(dbType: DBType) {
    this._dbType = dbType;
  }

  get dbType(): DBType {
    return this._dbType;
  }

  set dbType(value: DBType) {
    this._dbType = value;
  }
}
