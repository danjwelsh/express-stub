import {describe} from 'mocha';
import {App} from '../web/Server';
import {Server} from 'http';
import {DBType} from "../web/DBType";

describe('API', () => {
  process.env.TEST = 'true';

  //describe('MySQL', () => {
  //  let server: Server;
  //
  //  before(async () => {
  //    process.env.DB_TYPE = DBType.MySQL;
  //
  //    const app = new App();
  //    const port: number = 8889;
  //
  //    await app.initialiseServer();
  //
  //    await new Promise(resolve => {
  //      server = app.express.listen(port, resolve)
  //    })
  //
  //    //server = app.express.listen(port);
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
  //  })
  //});

  describe('Mongo', () => {
    let server: Server;

    before(async () => {
      process.env.DB_TYPE = DBType.Mongo;
      const app = new App();
      const port: number = 8888;

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
      require('./modules/MySQLResourceRepository');
    });
  });
});

