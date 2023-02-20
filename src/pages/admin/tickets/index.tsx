import type { Item, Purchase, Ticket } from "@prisma/client";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { api } from "../../../utils/api";

type TicketWithQuery = Ticket & {
  purchases: (Purchase & {
    item: Item;
  })[];
};

const Home: NextPage = () => {
  const tickets = api.tickets.listTicketsWithPurchaseamount.useQuery();
  const ticketMap = tickets.data?.map((ticket: TicketWithQuery) => (
    <div
      onClick={() => {
        Router.push({
          pathname: "/admin/tickets/details",
          query: { ticketId: ticket.ticketId },
        }).catch((error) => console.error(error));
      }}
      key={ticket.ticketId}
      className="grid cursor-pointer grid-cols-6 rounded px-2 hover:bg-blue-200"
    >
      <div className="col-span-2">{ticket.ticketId}</div>
      <div className="col-span-2">{ticket.holderName}</div>
      <div className="text-end">
        {(
          ticket.purchases.reduce((i, j) => {
            return i + j.item.price * (j.quantity - j.paid);
          }, 0) / 100
        ).toFixed(2)}
        €
      </div>
      <div className="text-end">
        {(
          ticket.purchases.reduce((i, j) => i + j.item.price * j.quantity, 0) /
          100
        ).toFixed(2)}
        €
      </div>
    </div>
  ));
  return (
    <>
      <Head>
        <title>MGAbiball</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700">
        <Link href={"/admin/"} className="absolute top-2 left-2 cursor-pointer">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 p-2 text-3xl">
            🔙
          </div>
        </Link>
        <h1 className="text-5xl font-extrabold tracking-tight text-white lg:text-7xl">
          Ticketkartenverwaltung
        </h1>
        <div className="container flex max-h-screen flex-col items-center justify-center gap-4 px-4 py-16">
          <div className="flex h-full w-full max-w-5xl flex-col gap-1 overflow-auto rounded-xl bg-white bg-opacity-90 p-4">
            <div className="grid grid-cols-6 px-2">
              <div className="col-span-2 font-bold">Ticket Id</div>
              <div className="col-span-2 font-bold">Name</div>
              <div className="text-end font-bold">Betrag (Offen)</div>
              <div className="text-end font-bold">Betrag (Gesamt)</div>
            </div>

            {ticketMap}
          </div>
          <Link
            href="tickets/create"
            className="flex h-full w-full max-w-5xl flex-col gap-1 overflow-auto rounded-xl bg-white/10  p-4 hover:bg-white/20"
          >
            <div className="text-center font-bold text-white">
              Neues Ticket ➕
            </div>
          </Link>
        </div>
      </main>
    </>
  );
};

export default Home;
