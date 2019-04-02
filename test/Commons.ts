import {DBType} from "../web/DBType";

export function getUrl(): string {
  switch (process.env.DB_TYPE) {
    case DBType.Mongo:
      return 'http://localhost:8888';
    case DBType.MySQL:
      return 'http://localhost:8889';
  }
}
