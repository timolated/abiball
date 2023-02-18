import type { Ticket } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import type { Dispatch, SetStateAction } from "react";

type Props = {
  changeView: Dispatch<SetStateAction<"scan" | "info">>;
  ticket: Ticket;
};

const CheckInTicketPage: NextPage<Props> = ({ changeView, ticket }) => {
  return (
    <div className="flex flex-col gap-4">
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Libre+Barcode+128+Text&display=swap"
          rel="stylesheet"
        />
      </Head>
      <div className="flex w-full max-w-full flex-col rounded-xl bg-gray-900 text-white md:max-w-md">
        <div className="bg-blur-lg flex grow flex-col rounded-l-xl p-2">
          <span className="my-4 text-2xl font-semibold">
            {ticket.holderName}
          </span>
          <span className="text-lg font-bold text-gray-300">
            Abiball Abivengers {new Date().toLocaleDateString()}
          </span>
          <span className="text-sm font-semibold tracking-widest text-gray-300">
            Mariengymnasium Bocholt
          </span>
        </div>
        <div className="flex justify-center rounded-b-lg bg-gray-50 p-2 text-black">
          <span className="text-center font-['Libre_Barcode_128_Text'] text-6xl">
            {ticket.ticketId}
          </span>
        </div>
      </div>
      <button
        className="rounded-lg bg-transparent p-2 text-white outline-none focus:font-bold"
        onClick={() => changeView("scan")}
        autoFocus
      >
        Check
      </button>
    </div>
  );
};
export default CheckInTicketPage;
