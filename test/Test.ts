import { describe } from 'mocha';
import { App } from '../web/Server';
import { Server } from 'http';

let server: Server;

describe('api', () => {
  const app = new App();

  before(async () => {
    const port: number = 8888;
    process.env.TEST = 'true';

    await app.initialiseServer();
    server = app.express.listen(port);
    console.log('started server')
  });

  after(async () => {
    await server.close();
  });

  /**
   * Import tests from files
   */
  require('./modules/Auth');
  require('./modules/Middleware');
  require('./modules/User');
  require('./modules/Resource');
});
