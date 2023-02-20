import type { Ticket } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import type { Dispatch, SetStateAction } from "react";
import TicketCard from "../ticket";

type Props = {
  changeView: Dispatch<SetStateAction<"scan" | "info">>;
  ticket: Ticket;
};

const CheckInTicketPage: NextPage<Props> = ({ changeView, ticket }) => {
  return (
    <div className="flex w-full flex-col gap-4 md:max-w-md">
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
      <TicketCard ticket={ticket} />
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
