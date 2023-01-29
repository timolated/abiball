import { Item } from "@prisma/client";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import ServiceCheckout from "./checkout";
import ServiceDrinkCount from "./count";
import ServiceDrinkview from "./drinkview";
import ServiceOverview from "./overview";
import ServiceSubtotal from "./subtotal";

export type ViewState = {
  type: "overview" | "category" | "drink" | "basket" | "checkout" | "count";
  categoryId?: string;
  parentId?: string;
};
export type BasketState = {
  items: Map<string, { item: Item; count: number }>;
  total: number;
};

const ServiceHome: NextPage = () => {
  const [basket, setBasket] = useState<BasketState>({
    items: new Map<string, { item: Item; count: number }>(),
    total: 0,
  });
  const [view, setView] = useState<ViewState>({
    type: "overview",
  });

  useEffect(() => {
    let total = 0;
    basket.items.forEach((item) => (total += item.count * item.item.price));
    if (total != basket.total) {
      setBasket((state) => {
        return { ...state, total: total };
      });
    }
  }, [basket]);

  return (
    <>
      {view.type == "overview" && (
        <ServiceOverview viewState={{ view, setView }} />
      )}
      {(view.type == "category" || view.type == "drink") && (
        <ServiceDrinkview
          viewState={{ view, setView }}
          basketState={{ basket, setBasket }}
        />
      )}
      {view.type == "count" && (
        <ServiceDrinkCount
          viewState={{ view, setView }}
          basketState={{ basket, setBasket }}
        />
      )}
      {view.type != "checkout" && (
        <ServiceSubtotal basket={basket} changeView={setView} />
      )}
      {view.type == "checkout" && (
        <ServiceCheckout
          basket={basket}
          changeView={setView}
          changeBasket={setBasket}
        />
      )}
    </>
  );
};

export default ServiceHome;
