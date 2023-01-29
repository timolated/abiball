import { Item } from "@prisma/client";
import { type NextPage } from "next";
import { Dispatch, SetStateAction } from "react";
import { BasketState, ViewState } from ".";
import { api } from "../../utils/api";

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
};

const DrinkItem: NextPage<Props> = ({ drink, viewState, basketState }) => {
  const childrenQuery = api.drinks.listDrinks.useQuery({ parentId: drink.id });

  return (
    <>
      {childrenQuery.data && (
        <button
          onClick={() => {
            // wenn keine weiteren subdrinks
            if (childrenQuery.data.length == 0) {
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
          {/* <span className="text-9xl">{category.icon??🍷}</span> */}
          <span className="text-9xl">🍷</span>
          <span className="text-2xl font-semibold">{drink.displayName}</span>
        </button>
      )}
    </>
  );
};

export default DrinkItem;
