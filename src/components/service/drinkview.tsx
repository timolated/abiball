import type { Category, Item } from "@prisma/client";
import { type NextPage } from "next";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { BasketState, ViewState } from "../../pages/service";
import DrinkItem from "./drinkitem";

type Props = {
  viewState: {
    view: ViewState;
    setView: Dispatch<SetStateAction<ViewState>>;
  };
  basketState: {
    basket: BasketState;
    setBasket: Dispatch<SetStateAction<BasketState>>;
  };
  data: (Category & {
    Item: Item[];
  })[];
};

const ServiceDrinkview: NextPage<Props> = ({
  viewState,
  basketState,
  data,
}) => {
  const [drinkCategories, setDrinkCategories] = useState<JSX.Element[]>();
  useEffect(() => {
    let drinksData: Item[] | undefined;
    if (viewState.view.type == "category") {
      drinksData = data
        .find((category) => category.id == viewState.view.categoryId)
        ?.Item.filter((item) => item.parentId == null);
    }
    if (viewState.view.type == "drink") {
      drinksData = data
        .find((category) => category.id == viewState.view.categoryId)
        ?.Item.filter((item) => item.parentId == viewState.view.parentId);
    }
    if (!drinksData) return;
    setDrinkCategories(
      drinksData.map((item) => (
        <DrinkItem
          key={item.id}
          drink={item}
          viewState={viewState}
          basketState={basketState}
          data={
            data
              .find((category) => category.id == viewState.view.categoryId)
              ?.Item.filter((drink) => drink.parentId == item.id) || []
          }
        />
      ))
    );
  }, [basketState, data, viewState]);

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
        <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
          Getränke{" "}
          {viewState.view.type == "category" && (
            <>{viewState.view.categoryId}</>
          )}
          {viewState.view.type == "drink" && <>{viewState.view.parentId}</>}
        </h1>
        <div className="grid grid-cols-2 gap-4 pb-16 sm:grid-cols-2 md:gap-8 md:pb-0">
          {drinkCategories}
        </div>
      </div>
    </>
  );
};

export default ServiceDrinkview;
