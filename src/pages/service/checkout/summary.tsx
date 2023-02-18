import { type NextPage } from "next";
import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { useEffect } from "react";
import type { BasketState, ViewState } from "..";

type Props = {
  changeView: Dispatch<SetStateAction<ViewState>>;
  changeBasket: Dispatch<SetStateAction<BasketState>>;
  changePage: Dispatch<SetStateAction<"summary" | "scan" | "validation">>;
  basket: BasketState;
};

const CheckoutSummary: NextPage<Props> = ({
  basket,
  changeView,
  changeBasket,
  changePage,
}) => {
  let itemCount = 0;
  [...basket.items.values()].forEach((basketItem) => {
    itemCount += basketItem.count;
  });
  useEffect(() => {
    if (basket.items.size == 0) {
      changeView((state) => {
        return {
          ...state,
          type: "overview",
        };
      });
    }
  }, [basket, changeView]);
  const handleCountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value);
    const itemId = e.target.getAttribute("itemID");
    if (!itemId) return;
    const itemRow = basket.items.get(itemId);
    if (!itemRow) return;
    changeBasket((state) => {
      if (value == 0) {
        // remove item
        basket.items.delete(itemId);
        return {
          ...basket,
          items: basket.items,
        };
      } else if (value > 0) {
        // change value
        return {
          ...basket,
          items: basket.items.set(itemId, { item: itemRow.item, count: value }),
        };
      }
      return state;
    });
  };
  return (
    <div className="flex grow flex-col items-center justify-center gap-2 px-2">
      <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-6xl">
        Zusammenfassung
      </h1>
      <div className="flex w-full max-w-md flex-col gap-2 rounded-xl bg-gradient-to-b from-white/10 to-white/20 p-2">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-white">
            {itemCount} {itemCount == 1 ? "Item" : "Items"}
          </div>
          {[...basket.items.values()].map((basketItem) => (
            <div
              key={basketItem.item.id}
              className="flex grow flex-row items-center gap-1 text-white"
            >
              <div className="flex flex-row gap-1">
                <input
                  type="number"
                  itemID={basketItem.item.id}
                  onChange={handleCountChange}
                  min={0}
                  max={99}
                  step={1}
                  defaultValue={basketItem.count}
                  autoComplete="off"
                  className="w-12 rounded-lg bg-white/20 p-2 text-center focus:outline-white"
                />
              </div>
              <span className="grow">{basketItem.item.displayName}</span>
              <span>
                {((basketItem.count * basketItem.item.price) / 100).toFixed(2)}€
              </span>
            </div>
          ))}
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
              return { ...state, type: "overview" };
            });
          }}
          className="flex grow cursor-pointer items-center justify-center rounded-lg bg-gradient-to-b from-red-500 to-red-600 p-2 px-4 align-middle text-white focus:from-red-600 focus:to-red-700 focus:outline-white"
        >
          Abbrechen
        </button>
        <button
          autoFocus
          onClick={() => {
            changePage("scan");
          }}
          className="flex grow-[4] cursor-pointer items-center justify-center rounded-lg bg-white p-2 px-4 align-middle"
        >
          Weiter
        </button>
      </div>
    </div>
  );
};

export default CheckoutSummary;
