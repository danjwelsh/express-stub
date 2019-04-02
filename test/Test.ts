import { describe } from 'mocha';
import { App } from '../web/Server';
import { Server } from 'http';

describe('API', () => {
  describe('MySQL', () => {
    process.env.TEST = 'true';
    process.env.DB_TYPE = 'MYSQL';
    let server: Server;

    before(async () => {
      const app = new App();
      const port: number = 8889;

      await app.initialiseServer();
      server = app.express.listen(port);
      console.log('started server')
    });

    after(async () => {
      await server.close();
    });

    describe('API', () => {
      /**
       * Import tests from files
       */
      require('./modules/Auth');
      require('./modules/Middleware');
      require('./modules/User');
      require('./modules/Resource');
    })
  });

  //describe('Mongo', () => {
  //  process.env.TEST = 'true';
  //  process.env.DB_TYPE = 'MONGO';
  //  let server: Server;
  //
  //  before(async () => {
  //    const app = new App();
  //    const port: number = 8888;
  //
  //    await app.initialiseServer();
  //    server = app.express.listen(port);
  //    console.log('started server')
  //  });
  //
  //  after(async () => {
  //    await server.close();
  //  });
  //
  //  describe('API', () => {
  //    /**
  //     * Import tests from files
  //     */
  //    require('./modules/Auth');
  //    require('./modules/Middleware');
  //    require('./modules/User');
  //    require('./modules/Resource');
  //  });
  //});
});
