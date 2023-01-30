import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { api } from "../../../utils/api";

const Home: NextPage = () => {
  const tickets = api.tickets.listTicketsWithPurchaseamount.useQuery();
  const ticketMap = tickets.data?.map((ticket) => (
    <div
      onClick={() => {
        Router.push({
          pathname: "/admin/tickets/details",
          query: { ticketId: ticket.ticketId },
        });
      }}
      key={ticket.ticketId}
      className="grid cursor-pointer grid-cols-6 rounded px-2 hover:bg-blue-200"
    >
      <div className="col-span-2">{ticket.ticketId}</div>
      <div className="col-span-2">{ticket.holderName}</div>
      <div className="pr-4 text-end">
        {(ticket.Purchase.reduce((i, j) => i + j.item.price, 0) / 100).toFixed(
          2
        )}
        €
      </div>
      <div>Unbekannt</div>
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
        <div className="container flex max-h-screen flex-col items-center justify-center gap-12 px-4 py-16">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Ticketkartenverwaltung
          </h1>
          <div className="flex h-full w-full max-w-xl flex-col gap-1 overflow-auto rounded-xl bg-white bg-opacity-90 p-4">
            <div className="grid grid-cols-6 px-2">
              <div className="col-span-2 font-bold">Ticket Id</div>
              <div className="col-span-2 font-bold">Name</div>
              <div className="font-bold">Betrag</div>
              <div className="font-bold">Status</div>
            </div>

            {ticketMap}
          </div>
          <Link
            href="tickets/create"
            className="flex h-full w-full max-w-xl flex-col gap-1 overflow-auto rounded-xl bg-white/10  p-4 hover:bg-white/20"
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
