import type { Item, Purchase } from "@prisma/client";
import type { NextPage } from "next";
import { useEffect } from "react";
import { useState } from "react";
import TransRow from "./transRow";
import UnpaidRow from "./unpaidRow";

type Props = {
  purchases: (Purchase & {
    item: Item;
  })[];
};

const CheckoutTable: NextPage<Props> = ({ purchases }) => {
  const [trans, setTrans] = useState(
    new Map<
      string,
      {
        purchase: Purchase & {
          item: Item;
        };
        amount: number;
      }
    >()
  );
  const [unpaid, setUnpaid] = useState(
    new Map<
      string,
      {
        purchase: Purchase & {
          item: Item;
        };
        amount: number;
      }
    >()
  );
  const [paid, setPaid] = useState(
    new Map<
      string,
      {
        purchase: Purchase & {
          item: Item;
        };
        amount: number;
      }
    >()
  );

  useEffect(() => {
    const unpaid2 = structuredClone(unpaid);
    purchases
      .filter((purchase) => purchase.paid < purchase.quantity)
      .forEach((purchase) =>
        unpaid2.set(purchase.purchaseId, {
          amount: purchase.quantity - purchase.paid,
          purchase,
        })
      );
    setUnpaid(unpaid2);

    const paid2 = structuredClone(paid);
    purchases
      .filter((purchase) => purchase.paid > 0)
      .forEach((purchase) =>
        paid2.set(purchase.purchaseId, {
          amount: purchase.paid,
          purchase,
        })
      );
    setPaid(paid2);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex w-full max-w-3xl flex-col gap-4">
      {[...trans.values()].filter((val) => val.amount > 0).length > 0 && (
        <div>
          <div className="rounded-t-lg bg-white p-2">
            <span>Zu bezahlen: </span>
            <span className="text-5xl font-bold">
              {(
                [...trans.values()].reduce(
                  (prev, value) =>
                    (prev += value.purchase.item.price * value.amount),
                  0
                ) / 100
              ).toFixed(2)}
              €
            </span>
          </div>
          <div className="flex bg-white p-2">
            <button className="grow rounded-lg  bg-green-700 p-2 text-xl font-bold text-white transition hover:bg-green-800">
              Als bezahlt kennzeichnen
            </button>
          </div>
          <div className="grid grid-cols-[auto_64px_64px] rounded-b-lg bg-white p-2">
            <>
              <div className="contents font-bold">
                <span>Zu bezahlende Getränke</span>
                <span className="text-end">Menge</span>
                <span className="text-end">Betrag</span>
              </div>
              {[...trans.values()].map((value) => {
                return (
                  <TransRow
                    key={value.purchase.purchaseId}
                    value={value}
                    trans={trans}
                    setTrans={setTrans}
                    unpaid={unpaid}
                    setUnpaid={setUnpaid}
                  />
                );
              })}
            </>
          </div>
        </div>
      )}
      {unpaid.size == 0 && (
        <div className="rounded-lg bg-green-600 p-4 py-8 text-3xl font-bold text-white">
          Keine unbezahlten Getränke
        </div>
      )}
      {unpaid.size > 0 && (
        <div>
          {[...trans.values()].filter((val) => val.amount > 0).length <= 0 && (
            <>
              <div className="rounded-t-lg bg-white p-2">
                <span>Offene Summme: </span>
                <span className="text-5xl font-bold">
                  {(
                    [...unpaid.values()].reduce(
                      (prev, value) =>
                        (prev += value.purchase.item.price * value.amount),
                      0
                    ) / 100
                  ).toFixed(2)}
                  €
                </span>
              </div>
              <div className="flex bg-white p-2">
                <button className="grow rounded-lg  bg-green-700 p-2 text-xl font-bold text-white transition hover:bg-green-800">
                  Alle als bezahlt kennzeichnen
                </button>
              </div>
            </>
          )}
          <div
            className={`grid grid-cols-[auto_64px_64px] ${
              [...trans.values()].filter((val) => val.amount > 0).length > 0
                ? "rounded-lg"
                : "rounded-b-lg"
            } bg-white p-2`}
          >
            <>
              <div className="contents font-bold">
                <span>Offene Getränke</span>
                <span className="text-end">Menge</span>
                <span className="text-end">Betrag</span>
              </div>
              {[...unpaid.values()].map((value) => {
                return (
                  <UnpaidRow
                    key={value.purchase.purchaseId}
                    value={value}
                    trans={trans}
                    setTrans={setTrans}
                    unpaid={unpaid}
                    setUnpaid={setUnpaid}
                  />
                );
              })}
            </>
          </div>
        </div>
      )}
      {paid.size > 0 && (
        <div className="grid grid-cols-[auto_64px_64px] gap-2 rounded-lg bg-gray-400 p-2">
          <>
            <div className="contents font-bold">
              <span>Bezahlte Getränke</span>
              <span className="text-end">Menge</span>
              <span className="text-end">Betrag</span>
            </div>
            {[...paid.values()].map((value) => {
              return (
                <div
                  key={value.purchase.purchaseId}
                  className="contents text-xl"
                >
                  <span className="py-2">
                    {value.purchase.item.displayName}
                  </span>
                  <span className="py-2 text-end">{value.purchase.paid}</span>
                  <span className="py-2 text-end">
                    {((value.amount * value.purchase.item.price) / 100).toFixed(
                      2
                    )}
                    €
                  </span>
                </div>
              );
            })}
          </>
        </div>
      )}
    </div>
  );
};
export default CheckoutTable;
