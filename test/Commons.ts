export function getUrl(): string {
  switch (process.env.DB_TYPE) {
    case 'MONGO':
      return 'http://localhost:8888';
    case 'MYSQL':
      return 'http://localhost:8889';
  }
}
