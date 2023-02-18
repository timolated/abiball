import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "../trpc";

export const ticketsRouter = createTRPCRouter({
  listTickets: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ticket.findMany();
  }),
  findTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.ticket.findFirst({
        where: {
          ...input,
        },
      });
    }),
  findTicketWithPurchaseamount: publicProcedure
    .input(z.object({ ticketId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.ticket.findFirst({
        where: {
          ...input,
        },
        include: {
          Purchase: {
            include: {
              item: true,
            },
          },
        },
      });
    }),
  listTicketsWithPurchaseamount: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.ticket.findMany({
      include: {
        Purchase: {
          include: {
            item: true,
          },
        },
      },
    });
  }),
  createTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.string().optional(),
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
        .catch(() =>
          console.log(
            `Could not create ticket with id ${input.ticketId ?? "[unkown id]"}`
          )
        );
    }),
  updateTicket: publicProcedure
    .input(
      z.object({
        ticketId: z.string(),
        newTicketId: z.string().optional(),
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
        ticketId: z.string(),
      })
    )
    .mutation(({ ctx, input }) => {
      return ctx.prisma.ticket
        .delete({
          where: {
            ticketId: input.ticketId,
          },
        })
        .catch((res) => console.log(res));
    }),
});
