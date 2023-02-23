import type { Item, Purchase, Ticket } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";
import TicketCard from "../ticket";
import CheckoutTable from "./checkoutTable";

type Props = {
  changeView: Dispatch<SetStateAction<"scan" | "info">>;
  ticket: Ticket;
};

type data =
  | Map<
      string,
      (Purchase & {
        item: Item;
      })[]
    >
  | undefined;

const CheckOutTicketPage: NextPage<Props> = ({ ticket }) => {
  const ticketQuery = api.tickets.findTicketWithPurchaseamount.useQuery({
    ticketId: ticket.ticketId,
  });
  const [data, setData] = useState<data>();
  useEffect(() => {
    if (!ticketQuery.data) return;

    ticketQuery.data?.purchases.map((purchase) => <>{purchase.itemId}</>);

    const purchasesGroupedByItemId = new Map<
      string,
      (Purchase & { item: Item })[]
    >();
    ticketQuery.data.purchases.forEach((purchase) => {
      if (purchasesGroupedByItemId.has(purchase.itemId)) {
        purchasesGroupedByItemId.get(purchase.itemId)!.push(purchase);
      } else {
        purchasesGroupedByItemId.set(purchase.itemId, [purchase]);
      }
    });
    setData(purchasesGroupedByItemId);
  }, [ticketQuery.data]);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
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
      {data && <TicketCard ticket={ticket} />}
      {data && <CheckoutTable purchases={ticketQuery.data!.purchases} />}
    </div>
  );
};
export default CheckOutTicketPage;
