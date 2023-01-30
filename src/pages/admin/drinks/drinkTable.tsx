import { NextPage } from "next";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api";

type Props = {
  categoryId?: string;
  parentId?: string;
  mode: "category" | "drink";
};

const DrinkTable: NextPage<Props> = ({ mode, categoryId, parentId }) => {
  const drinksQuery = api.drinks.listDrinks.useQuery({
    categoryId: categoryId,
    parentId: parentId,
  });
  const [drinks, setDrinks] = useState<any>();

  useEffect(() => {
    let queryResult = drinksQuery.data;
    if (!queryResult) return;
    const table = queryResult.map((item) => {
      if (
        (mode == "category" && !item.parentId) ||
        (mode == "drink" && item.parentId == parentId)
      ) {
        const children = queryResult!.filter(
          (child) => child.parentId == item.id
        );

        return (
          <div className=" contents" key={item.id}>
            <Link
              href={`/admin/drinks/details?drink=${item.id}`}
              key={item.id}
              className="grid cursor-pointer grid-cols-3 rounded px-2 hover:bg-blue-200"
            >
              <div className="col-span-2">
                {item.displayName}
                {children.length == 1 && (
                  <span className="ml-2 text-xs font-semibold text-gray-700">
                    (+{children.length} Subgetränk)
                  </span>
                )}
                {children.length > 1 && (
                  <span className="ml-2 text-xs font-semibold text-gray-700">
                    (+{children.length} Subgetränke)
                  </span>
                )}
              </div>
              <div>
                {item.price != 0 ? (
                  <>{(item.price / 100).toFixed(2)}€</>
                ) : (
                  <></>
                )}
              </div>
              <div className="col-span-2 -mt-1 text-xs font-semibold text-gray-500">
                {item.id}
              </div>
            </Link>
          </div>
        );
      }
    });
    setDrinks(table);
  }, [drinksQuery.dataUpdatedAt]);

  return (
    <>
      {drinksQuery.data?.length == 0 && (
        <div
          onClick={() => {
            Router.back();
          }}
          className="group flex w-full max-w-md cursor-pointer flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition "
        >
          <p>Ziemlich leer hier 🐧</p>
          <p className="group-hover:underline">Zurück</p>
        </div>
      )}
      {(drinksQuery.data?.length ?? 0) > 0 && (
        <div className="flex h-full w-full max-w-md flex-col gap-1 overflow-auto rounded-xl bg-white bg-opacity-90 p-4">
          <div className="grid grid-cols-3 px-2 font-semibold">
            <div className="col-span-2">Name</div>
            <div>Preis</div>
          </div>
          {drinks}
        </div>
      )}
    </>
  );
};

export default DrinkTable;
