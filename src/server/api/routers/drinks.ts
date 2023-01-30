import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const drinksRouter = createTRPCRouter({
  listDrinks: publicProcedure
    .input(
      z.object({
        id: z.string().optional(),
        displayName: z.string().optional(),
        categoryId: z.string().optional(),
        icon: z.string().optional(),
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
        categoryId: z.string(),
        price: z.number().optional(),
        icon: z.string().optional(),
        parentId: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.item
        .create({
          data: {
            id: input.name.toLowerCase().replaceAll(" ", "-"),
            displayName: input.name,
            categoryId: input.categoryId,
            price: input.price || undefined,
            icon: input.icon || undefined,
            parentId: input.parentId || undefined,
          },
        })
        .catch((reason) =>
          console.log("Could not create drink " + input.name, reason)
        );
    }),
  updateDrink: publicProcedure
    .input(
      z.object({
        id: z.string(),
        newId: z.string().optional(),
        displayName: z.string().optional(),
        categoryId: z.string().optional(),
        price: z.number().optional(),
        icon: z.string().optional(),
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
          icon: input.icon,
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
      return ctx.prisma.item
        .delete({
          where: {
            id: input.id,
          },
        })
        .catch((res) => console.log(res));
    }),
});
