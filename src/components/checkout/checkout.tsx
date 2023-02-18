import type { Item, Purchase, Ticket } from "@prisma/client";
import type { NextPage } from "next";
import Head from "next/head";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import { api } from "../../utils/api";

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

    ticketQuery.data?.Purchase.map((purchase) => <>{purchase.itemId}</>);

    const purchasesGroupedByItemId = new Map<
      string,
      (Purchase & { item: Item })[]
    >();
    ticketQuery.data.Purchase.forEach((purchase) => {
      if (purchasesGroupedByItemId.has(purchase.itemId)) {
        purchasesGroupedByItemId.get(purchase.itemId)!.push(purchase);
      } else {
        purchasesGroupedByItemId.set(purchase.itemId, [purchase]);
      }
    });
    setData(purchasesGroupedByItemId);
  }, [ticketQuery.data]);

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
      {data && (
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
      )}
      {data && (
        <div className="flex max-w-full flex-col rounded-lg bg-white p-2 md:max-w-md">
          <div className="grid grid-cols-[1fr_minmax(200px,_8fr)_1fr_1fr] gap-2 font-bold">
            <span>#</span>
            <span>Item</span>
            <span className="col-span-2 text-end">Betrag</span>
          </div>
          {[...data.keys()].map((item) => (
            <div
              key={item}
              className="grid grid-cols-[1fr_minmax(200px,_8fr)_1fr_1fr] gap-2"
            >
              <span className="">
                {data
                  .get(item)!
                  .reduce((prev, curr) => (prev += curr.quantity), 0)}
              </span>
              <span className="">{data.get(item)![0]?.item.displayName}</span>
              <span className="self-center whitespace-nowrap text-sm font-semibold text-gray-400">
                {data
                  .get(item)!
                  .reduce((prev, curr) => (prev += curr.quantity), 0)}
                x {(data.get(item)![0]?.item.price ?? 0 / 100).toFixed(2)}€
              </span>
              <span className="">
                {(
                  data
                    .get(item)!
                    .reduce(
                      (prev, curr) => (prev += curr.quantity * curr.item.price),
                      0
                    ) / 100
                ).toFixed(2)}
                €
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
export default CheckOutTicketPage;
