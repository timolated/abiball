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

const CheckInTicketPage: NextPage<Props> = ({ ticket }) => {
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
    // const purchasesGroupedByParentId = new Map<
    //   string,
    //   { itemId: string; purchases: (Purchase & { item: Item })[] }
    // >();
    // [...purchasesGroupedByItemId.keys()].forEach((key) => {
    //   if (purchasesGroupedByParentId.has(key)) {
    //     purchasesGroupedByItemId.get(key)![0]!.item.parentId;
    //   } else {
    //     const parentIdOfGroup =
    //       purchasesGroupedByItemId.get(key)![0]!.item.parentId;
    //     if (parentIdOfGroup) {
    //       purchasesGroupedByParentId.set(parentIdOfGroup, {
    //         itemId: parentIdOfGroup,
    //         purchases: purchasesGroupedByItemId.get(key) || [],
    //       });
    //     }
    //   }
    // });
    /*
    const purchasesGroupedByParentId2 = new Map<
      string,
      {
        parentId: string;
        purchaseGroups: {
          itemId: string;
          purchases: (Purchase & { item: Item })[];
        };
      }
    >();
    [...purchasesGroupedByParentId.keys()].forEach((key) => {
      if (purchasesGroupedByParentId2.has(key)) {
        purchasesGroupedByParentId.get(key)!.itemId;
      } else {
        const parentIdOfGroup =
          purchasesGroupedByParentId.get(key)!.purchases[0]?.item.parentId; // brauchen davon nochmal die parentId
        console.log(parentIdOfGroup);
        if (parentIdOfGroup) {
          purchasesGroupedByParentId2.set(parentIdOfGroup, {
            parentId: parentIdOfGroup,
            purchaseGroups: {
              itemId: key,
              purchases: purchasesGroupedByParentId.get(key)!.purchases || [],
            },
          });
        }
      }
    });*/
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
          href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap"
          rel="stylesheet"
        />
      </Head>
      {data && (
        <div className="flex h-40 w-full max-w-md flex-row rounded-xl bg-white">
          <div className="bg-blur-lg flex grow flex-col rounded-l-xl bg-gradient-to-br from-blue-200 to-purple-200 p-2">
            <span className="text-2xl font-bold text-gray-500">
              Abiball Abivengers
            </span>
            <span className="text-lg font-semibold tracking-widest text-gray-400">
              Mariengymnasium Bocholt
            </span>
            <span className="my-4 text-2xl font-semibold">
              {ticket.holderName}
            </span>
            <span className="font-bold text-gray-500">
              {new Date().toLocaleDateString()}
            </span>
          </div>
          <div className="-ml-1 flex cursor-vertical-text items-center border-l-8 border-dotted border-black">
            <div className="flex -rotate-90 flex-col">
              <span className="font-['Libre_Barcode_39'] text-5xl leading-3">
                {ticket.ticketId}
              </span>
              <span>{ticket.ticketId}</span>
            </div>
          </div>
        </div>
      )}
      {data && (
        <div className="flex max-w-md flex-col rounded-lg bg-white p-2">
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
export default CheckInTicketPage;
