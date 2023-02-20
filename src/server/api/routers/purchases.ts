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
    .mutation(async ({ ctx, input }) => {
      void ctx.prisma.purchaseLog
        .create({
          data: {
            ...input,
          },
        })
        .catch((error: unknown) => console.error(error));

      const purchase = await ctx.prisma.purchase
        .findFirst({
          where: {
            buyerId: input.buyerId,
            itemId: input.itemId,
          },
        })
        .catch((error: unknown) => console.error(error));

      if (purchase) {
        return ctx.prisma.purchase.update({
          where: { purchaseId: purchase.purchaseId },
          data: {
            quantity: purchase.quantity + (input.quantity ?? 1),
          },
        });
      }

      return ctx.prisma.purchase.create({
        data: {
          ...input,
        },
      });
    }),
  updatePurchase: publicProcedure
    .input(
      z.object({
        purchaseId: z.string(),
        quantity: z.number().optional(),
        paid: z.number().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.purchase.update({
        where: { purchaseId: input.purchaseId },
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
