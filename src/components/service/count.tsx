import type { Item } from "@prisma/client";
import { type NextPage } from "next";
import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { BasketState, ViewState } from "../../pages/service";

type Props = {
  viewState: {
    view: ViewState;
    setView: Dispatch<SetStateAction<ViewState>>;
  };
  basketState: {
    basket: BasketState;
    setBasket: Dispatch<SetStateAction<BasketState>>;
  };
};

const ServiceDrinkCount: NextPage<Props> = ({ viewState, basketState }) => {
  const [item, setItem] = useState<{ item: Item; count: number } | undefined>();
  useEffect(() => {
    setItem(basketState.basket.items.get(viewState.view.parentId!));
  }, [basketState.basket.items, viewState.view.parentId]);
  const handleCountChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    const value = parseInt(e.target.value);
    changeValue(value);
  };
  const changeValue = (value: number) => {
    basketState.setBasket((state) => {
      if (value > 0 && item) {
        // change value
        return {
          ...state,
          items: state.items.set(item?.item.id, {
            item: item?.item,
            count: value,
          }),
        };
      }
      return state;
    });
    if (item) setItem({ ...item, count: value });
  };
  return (
    <>
      <div
        onClick={() =>
          viewState.setView({ ...viewState.view, type: "overview" })
        }
        className="absolute top-2 left-2 cursor-pointer"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 p-2 text-3xl">
          🔙
        </div>
      </div>
      <div className="container flex flex-col items-center justify-center gap-4">
        <div>
          <h1 className="text-center text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Anzahl
          </h1>
          <h2 className="text-center text-2xl font-bold tracking-tight text-white">
            {item?.item.displayName}
          </h2>
        </div>
        <div className="grid grid-cols-3 gap-4">
          <button
            disabled={(item?.count ?? -1) <= 1}
            onClick={() => {
              if ((item?.count ?? -1) > 1) changeValue((item?.count ?? -1) - 1);
            }}
            className="rounded-lg bg-white/20 p-2 text-center text-7xl font-bold text-white focus:outline-white disabled:bg-black/20"
          >
            ➖
          </button>
          <input
            type="number"
            onChange={handleCountChange}
            min={1}
            max={99}
            step={1}
            value={item?.count || 1}
            autoComplete="off"
            className=" rounded-lg bg-white/20 p-2 text-center text-7xl font-bold text-white focus:outline-white"
          />
          <button
            disabled={(item?.count ?? -1) >= 99}
            onClick={() => {
              if ((item?.count ?? -1) < 99)
                changeValue((item?.count ?? -1) + 1);
            }}
            className="rounded-lg bg-white/20 p-2 text-center text-7xl font-bold text-white focus:outline-white disabled:bg-black/20"
          >
            ➕
          </button>
        </div>
        <button
          autoFocus
          onClick={() => {
            viewState.setView((state) => {
              return { ...state, type: "overview" };
            });
          }}
          className="flex grow cursor-pointer items-center justify-center rounded-lg bg-white p-2 px-4 align-middle"
        >
          Speichern
        </button>
      </div>
    </>
  );
};

export default ServiceDrinkCount;
