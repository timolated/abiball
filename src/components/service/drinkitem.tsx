import type { Item } from "@prisma/client";
import { type NextPage } from "next";
import type { Dispatch, SetStateAction } from "react";
import type { ViewState, BasketState } from "../../pages/service";

type Props = {
  drink: Item;
  viewState: {
    view: ViewState;
    setView: Dispatch<SetStateAction<ViewState>>;
  };
  basketState: {
    basket: BasketState;
    setBasket: Dispatch<SetStateAction<BasketState>>;
  };
  data: Item[];
};

const DrinkItem: NextPage<Props> = ({
  drink,
  viewState,
  basketState,
  data,
}) => {
  return (
    <>
      {data && (
        <button
          onClick={() => {
            // wenn keine weiteren subdrinks
            if (data.length == 0) {
              basketState.setBasket((state) => {
                if (state.items.has(drink.id)) {
                  const drinkItem = {
                    item: state.items.get(drink.id)!.item,
                    count: state.items.get(drink.id)!.count + 1,
                  };
                  return {
                    ...state,
                    items: state.items.set(drink.id, drinkItem),
                  };
                } else {
                  return {
                    ...state,
                    items: state.items.set(drink.id, { item: drink, count: 1 }),
                  };
                }
              });
              viewState.setView((state) => {
                return { ...state, parentId: drink.id, type: "count" };
              });
            } else {
              // wenn weitere subdrinks
              viewState.setView((state) => {
                return {
                  ...state,
                  type: "drink",
                  parentId: drink.id,
                };
              });
            }
          }}
          key={drink.id}
          className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
        >
          <span className="text-9xl">{drink.icon ?? <>🍷</>}</span>
          <span className="text-2xl font-semibold">{drink.displayName}</span>
        </button>
      )}
    </>
  );
};

export default DrinkItem;
