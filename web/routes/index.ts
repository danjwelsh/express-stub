import { Express } from "express";
import { AuthRouter } from "./api/AuthRouter";
import { HomeRouter } from "./Home";
import ResourceRouterFactory from "./ResourceRouterFactory";
import RouterSchema from "./RouterSchema";

/**
 * Add routes to the router.
 *
 * @param {e.Express} app
 * @returns {e.Express}
 */
export default function addRoutes(app: Express): Express {
  app.use("/", new HomeRouter().getRouter());
  app.use("/api/auth", new AuthRouter().getRouter());

  // Generate routes from the route schema
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

/*
 * RouterSchema
 *
 * Add a router schema for each resource, requires:
 *   Route
 *   Table name
 *   Resource Options
 */
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

// Get a schema matching the route.
export function getSchema(route: string): RouterSchema {
  return routes.find(
    (schema: RouterSchema) => route.indexOf(schema.getRoute()) > -1
  );
}
