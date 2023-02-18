import type { Purchase } from "@prisma/client";
import { type NextPage } from "next";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { BasketState, ViewState } from "../../../pages/service";
import { api } from "../../../utils/api";

type Props = {
  changeView: Dispatch<SetStateAction<ViewState>>;
  changeBasket: Dispatch<SetStateAction<BasketState>>;
  changePage: Dispatch<SetStateAction<"summary" | "scan" | "validation">>;
  basket: BasketState;
  ticket: string;
};

const CheckoutValidation: NextPage<Props> = ({
  basket,
  changeView,
  changeBasket,
  changePage,
  ticket,
}) => {
  const [transactions, setTransactions] = useState<Purchase[]>([]);
  const getTicketQunery = api.tickets.findTicket.useQuery({ ticketId: ticket });
  const processpurchasemutation = api.purchases.makePurchase.useMutation();
  useEffect(() => {
    const process = () => {
      const purchases: Purchase[] = [];
      // eslint-disable-next-line @typescript-eslint/no-misused-promises
      [...basket.items.values()].forEach(async (basketItem) => {
        const purchase = await processpurchasemutation.mutateAsync({
          buyerId: ticket,
          quantity: basketItem.count,
          itemId: basketItem.item.id,
        });
        purchases.push(purchase);
      });
      setTransactions(purchases);
    };
    void process();
  }, [basket.items, processpurchasemutation, ticket]);
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-2 bg-gradient-to-b from-blue-600 to-violet-700">
      {transactions.length == basket.items.size && (
        <div className="flex w-full max-w-md flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-b from-green-500 to-green-600 p-2">
          <div className="p-4 text-7xl font-extrabold text-white">Fertig🐧</div>
        </div>
      )}
      <div className="flex w-full max-w-md flex-col gap-2 rounded-xl bg-gradient-to-b from-white/10 to-white/20 p-2">
        <h1 className="text-xl font-semibold tracking-tight text-white">
          Auftrag für {getTicketQunery.data?.holderName}
        </h1>
        <div className="flex flex-col gap-1">
          {[...basket.items.values()].map((basketItem) => {
            const result = transactions.find(
              (trans) => trans.itemId == basketItem.item.id
            );
            return (
              <div
                key={basketItem.item.id}
                className="flex grow flex-row items-center gap-1 text-white"
              >
                {result && <>✅</>}
                <div className="flex flex-row gap-1"></div>
                <span className="grow">
                  {basketItem.count}x {basketItem.item.displayName}
                </span>
                <span>
                  {((basketItem.count * basketItem.item.price) / 100).toFixed(
                    2
                  )}
                  €
                </span>
              </div>
            );
          })}
        </div>
        <div className="flex grow flex-row">
          <div className="relative flex grow justify-end font-bold text-white">
            <span className="text-right before:absolute before:right-0 before:left-2/3 before:-top-1 before:block before:h-px  before:bg-white">
              Total: {(basket.total / 100).toFixed(2)}€
            </span>
          </div>
        </div>
      </div>
      <div className="mt-2 flex w-full max-w-md gap-2">
        <button
          onClick={() => {
            changeView((state) => {
              return {
                ...state,
                type: "overview",
              };
            });
            changeBasket((state) => {
              basket.items.clear();
              return { ...state, total: 0 };
            });
            changePage("summary");
          }}
          className="flex grow-[4] cursor-pointer items-center justify-center rounded-lg bg-white p-2 px-4 align-middle"
          autoFocus
        >
          Fertig
        </button>
      </div>
    </main>
  );
};

export default CheckoutValidation;
