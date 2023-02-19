import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const purchasesRouter = createTRPCRouter({
  listPurchases: publicProcedure
    .input(
      z.object({
        buyerId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.purchase.findMany({
        where: {
          ...input,
        },
      });
    }),
  makePurchase: publicProcedure
    .input(
      z.object({
        buyerId: z.string(),
        itemId: z.string(),
        quantity: z.number().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      void ctx.prisma.purchaseLog
        .create({
          data: {
            ...input,
          },
        })
        .catch((error: unknown) => console.error(error))
        .then((fin: unknown) => console.log(fin));
      return ctx.prisma.purchase.create({
        data: {
          ...input,
        },
      });
    }),
  removePurchase: publicProcedure
    .input(
      z.object({
        purchaseId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.purchase.delete({
        where: { purchaseId: input.purchaseId },
      });
    }),
});
