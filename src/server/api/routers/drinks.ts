import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const drinksRouter = createTRPCRouter({
  listDrinks: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        displayName: z.string().optional(),
        categoryId: z.string().optional(),
        // barcode: z.number().optional(),
        parentId: z.string().optional(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.item.findMany({
        where: { ...input },
      });
    }),
  createDrink: publicProcedure
    .input(
      z.object({
        name: z.string(),
        category: z.string(),
        price: z.number(),
        // barcode: z.number().optional(),
        parentId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item
        .create({
          data: {
            id: input.name.toLowerCase().replaceAll(" ", "-"),
            displayName: input.name,
            categoryId: input.category,
            price: input.price,
            // barcode: input.barcode || -1,
            parentId: input.parentId || undefined,
          },
        })
        .catch((reason) => console.log("Could not create drink " + input.name));
    }),
  updateDrink: publicProcedure
    .input(
      z.object({
        id: z.string(),
        newId: z.string().optional(),
        displayName: z.string().optional(),
        categoryId: z.string().optional(),
        price: z.number().optional(),
        // barcode: z.number().optional(),
        parentId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.newId,
          displayName: input.displayName,
          categoryId: input.categoryId,
          price: input.price,
          // barcode: input.barcode || -1,
          parentId: input.parentId,
        },
      });
    }),
  deleteDrink: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
