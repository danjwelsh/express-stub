import { Express } from "express";
import { AuthRouter } from "./api/AuthRouter";
import { HomeRouter } from "./Home";
import ResourceRouterFactory from "./ResourceRouterFactory";
import RouterSchema from "./RouterSchema";

/**
 * [use description]
 * @return       [description]
 * @param app
 */
export function addRoutes(app: Express): Express {
  app.use("/", new HomeRouter().getRouter());
  app.use("/api/auth", new AuthRouter().getRouter());

  routes.forEach((schema: RouterSchema) => {
    app.use(
      schema.getRoute(),
      ResourceRouterFactory.getResourceRouter(
        schema.getTable(),
        schema.getOptions()
      ).getRouter()
    );
  });

  return app;
}

export default addRoutes;

export const routes: RouterSchema[] = [
  new RouterSchema(
    {
      isOwned: false,
      isProtected: true
    },
    "/api/user",
    "user"
  )
];

export function getSchema(route: string): RouterSchema {
  return routes.find(
    (schema: RouterSchema) => route.indexOf(schema.getRoute()) > -1
  );
}
