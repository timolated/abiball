import type { Category, Item } from "@prisma/client";
import { type NextPage } from "next";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { ViewState } from "../../pages/service";

type Props = {
  viewState: {
    view: ViewState;
    setView: Dispatch<SetStateAction<ViewState>>;
  };
  data: (Category & {
    Item: Item[];
  })[];
};

const ServiceOverview: NextPage<Props> = ({ viewState, data }) => {
  const [drinkCategories, setDrinkCategories] = useState<JSX.Element[]>();
  useEffect(() => {
    setDrinkCategories(
      data.map((item) => (
        <button
          onClick={() => {
            viewState.setView({
              ...viewState.view,
              type: "category",
              categoryId: item.id,
            });
          }}
          key={item.id}
          className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
        >
          <span className="text-9xl">{item.icon ?? <>🍷</>}</span>
          <span className="text-2xl font-semibold">{item.displayName}</span>
        </button>
      ))
    );
  }, [data, viewState]);

  return (
    <div className="container flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
        Getränke
      </h1>
      <div className="grid grid-cols-2 gap-4 pb-16 sm:grid-cols-2 md:gap-8 md:pb-0">
        {drinkCategories}
      </div>
    </div>
  );
};

export default ServiceOverview;
