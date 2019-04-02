import 'reflect-metadata';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as handler from './middleware/Handler';
import { addRoutes } from './routes';
import * as dotenv from 'dotenv';
import {DatabaseFactory} from "./DatabaseFactory";
dotenv.load();

/**
 * Class that Models the server application.
 * Initialises a new instance of an express application in the constructor.
 * Can be started with App.express.listen(PORT: number).
 */
export class App {
  public express: express.Express;

  constructor() {
    this.express = express();

    this.connectToDB()
      .then(() => {
        // Descriptions of each in method declaration.
        this.prepareStatic();
        this.setViewEngine();
        this.setBodyParser();
        this.addCors();
        this.setAppSecret();
        this.addRoutes(this.express);
        this.setErrorHandler();
      })
      .catch((error) => {
        console.error(error);
        console.error('Could not connect to database');
        process.exit(1);
      });
  }

  /**
   * Prepare the static folder.
   * Contains api docs.
   */
  private prepareStatic(): void {
    this.express.use('/', express.static(`${__dirname}/../../static/apidoc`));
  }

  /**
   * Set view engine for html.
   */
  private setViewEngine(): void {
    this.express.set('view engine', 'ejs');
    this.express.engine('html', require('ejs').renderFile);
  }

  /**
   * Create and add the routers, must pass the app.
   * @param {e.Express} app
   */
  private addRoutes (app: express.Express): void {
    this.express = addRoutes(app);
  }

  /**
   * Set body parser to access post parameters.
   */
  private setBodyParser(): void {
    this.express.use(bodyParser.json());
    this.express.use(bodyParser.urlencoded({
      extended: true,
    }));
  }

  /**
   * Add CORS
   */
  private addCors(): void {
    this.express.use(cors());
    this.express.options('*', cors());
  }

  /**
   * Set the application secret to sign JWT tokens.
   */
  private setAppSecret(): void {
    this.express.set('secret', process.env.SECRET);
  }

  /**
   * Set the error handler.
   */
  private setErrorHandler(): void {
    this.express.use(handler.handleResponse);
  }

  private async connectToDB(): Promise<void> {
    await DatabaseFactory.getConnection();
  }
}
