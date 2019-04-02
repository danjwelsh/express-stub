import { describe } from "mocha";

describe("API", () => {
  process.env.TEST = "true";

  /**
   * Import tests from files
   */
  require("./modules/Auth");
  require("./modules/Middleware");
  require("./modules/User");
  require("./modules/Resource");
  require("./modules/MySQLResourceRepository");
  require("./modules/MongoResourceRepository");
});
