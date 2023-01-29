import { string, z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const categoriesRouter = createTRPCRouter({
  getCategoryName: publicProcedure
    .input(z.object({ categoryId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.category.findFirst({
        where: { id: input.categoryId },
        select: { displayName: true },
      });
    }),
  listCategories: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.category.findMany();
  }),
  createCategory: publicProcedure
    .input(
      z.object({
        displayName: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category
        .create({
          data: {
            id: input.displayName.toLowerCase().replaceAll(" ", "-"),
            displayName: input.displayName,
          },
        })
        .catch((reason) =>
          console.log("Could not create category " + input.displayName)
        );
    }),
  updateCategory: publicProcedure
    .input(
      z.object({
        id: z.string(),
        newDisplayName: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.category.update({
        where: {
          id: input.id,
        },
        data: {
          id: input.newDisplayName.toLowerCase().replace(" ", "-"),
          displayName: input.newDisplayName,
        },
      });
    }),
  deleteCategory: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (
        (await ctx.prisma.item.count({
          where: {
            categoryId: input.id,
          },
        })) > 0
      ) {
        return "error";
      } else {
        return ctx.prisma.category.delete({ where: { id: input.id } });
      }
    }),
});
