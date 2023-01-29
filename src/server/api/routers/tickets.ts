import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const ticketsRouter = createTRPCRouter({
  listTickets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ticket.findMany();
  }),
  findTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.ticket.findFirst({
        where: {
          ...input,
        },
      });
    }),
  createTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.number().optional(),
        holderName: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.ticket
        .create({
          data: {
            ...input,
          },
        })
        .catch((reason) =>
          console.log("Could not create ticket with id " + input.ticketId)
        );
    }),
  updateTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
        newTicketId: z.number().optional(),
        holderName: z.string().optional(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.ticket.update({
        where: {
          ticketId: input.ticketId,
        },
        data: {
          ticketId: input.newTicketId,
          holderName: input.holderName,
        },
      });
    }),
  deleteTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.number(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.ticket.delete({
        where: {
          ticketId: input.ticketId,
        },
      });
    }),
});
