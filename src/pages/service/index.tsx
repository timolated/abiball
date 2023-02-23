import type { Item } from "@prisma/client";
import { type NextPage } from "next";
import { useEffect, useState } from "react";
import ServiceCheckout from "../../components/service/checkout";
import ServiceDrinkCount from "../../components/service/count";
import ServiceDrinkview from "../../components/service/drinkview";
import ServiceOverview from "../../components/service/overview";
import ServiceSubtotal from "../../components/service/subtotal";
import { api } from "../../utils/api";

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
  const categoriesRecursiveQuery =
    api.categories.listCategoriesRecursive.useQuery();
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
    <main className="flex h-screen items-center justify-center overflow-auto bg-gradient-to-b from-blue-600 to-violet-700 p-4">
      {view.type == "overview" && categoriesRecursiveQuery.data && (
        <ServiceOverview
          viewState={{ view, setView }}
          data={categoriesRecursiveQuery.data}
        />
      )}
      {(view.type == "category" || view.type == "drink") &&
        categoriesRecursiveQuery.data && (
          <ServiceDrinkview
            viewState={{ view, setView }}
            basketState={{ basket, setBasket }}
            data={categoriesRecursiveQuery.data}
          />
        )}
      {view.type == "count" && categoriesRecursiveQuery.data && (
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
    </main>
  );
};

export default ServiceHome;
