import type { Item, Purchase } from "@prisma/client";
import type { NextPage } from "next";

type Props = {
  purchases: (Purchase & {
    item: Item;
  })[];
};

const CheckoutTable: NextPage<Props> = ({ purchases }) => {
  const unpaid = purchases.filter(
    (purchase) => purchase.paid < purchase.quantity
  );
  return (
    <div className="flex max-w-full flex-col rounded-lg bg-white p-2 md:max-w-md">
      <div className="grid grid-cols-3 gap-2 font-bold">
        <>
          <div className="contents font-bold">
            <span>Item</span>
            <span className="col-span-2 text-end">Menge Unbezahlt</span>
            <span className="col-span-2 text-end">Offener Betrag</span>
          </div>
          {unpaid.map((purchase) => {
            <div className="contents font-bold">
              <span>{purchase.item.displayName}</span>
              <span className="col-span-2 text-end">
                {purchase.quantity - purchase.paid}
              </span>
              <span className="col-span-2 text-end">
                {(
                  ((purchase.quantity - purchase.paid) * purchase.item.price) /
                  100
                ).toFixed(2)}
                €
              </span>
            </div>;
          })}
        </>
      </div>
    </div>
  );
};
export default CheckoutTable;
