import { createTRPCRouter } from "./trpc";
import { exampleRouter } from "./routers/example";
import { categoriesRouter } from "./routers/category";
import { drinksRouter } from "./routers/drinks";
import { purchasesRouter } from "./routers/purchases";
import { ticketsRouter } from "./routers/tickets";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter, // todo: remove
  categories: categoriesRouter,
  drinks: drinksRouter,
  purchases: purchasesRouter,
  tickets: ticketsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
