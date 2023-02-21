import type { Purchase, Item } from "@prisma/client";
import type { NextPage } from "next";
import type { Dispatch, SetStateAction } from "react";

type RowProps = {
  value: {
    amount: number;
    purchase: Purchase & {
      item: Item;
    };
  };
  trans: Map<
    string,
    {
      purchase: Purchase & {
        item: Item;
      };
      amount: number;
    }
  >;
  setTrans: Dispatch<
    SetStateAction<
      Map<
        string,
        {
          purchase: Purchase & {
            item: Item;
          };
          amount: number;
        }
      >
    >
  >;
  unpaid: Map<
    string,
    {
      purchase: Purchase & {
        item: Item;
      };
      amount: number;
    }
  >;
  setUnpaid: Dispatch<
    SetStateAction<
      Map<
        string,
        {
          purchase: Purchase & {
            item: Item;
          };
          amount: number;
        }
      >
    >
  >;
};

const UnpaidRow: NextPage<RowProps> = ({
  value,
  trans,
  setTrans,
  unpaid,
  setUnpaid,
}) => {
  return (
    <button
      key={value.purchase.purchaseId}
      className="group contents cursor-default text-xl disabled:text-gray-400"
      disabled={value.amount == 0}
      onClick={() => {
        if (value.amount <= 0) return;

        // modify in-transition
        const trans2 = structuredClone(trans);
        trans2.set(value.purchase.purchaseId, {
          amount: (trans.get(value.purchase.purchaseId)?.amount || 0) + 1,
          purchase: value.purchase,
        });
        setTrans(trans2);

        // modify unpaid
        const unpaid2 = structuredClone(unpaid);
        unpaid2.set(value.purchase.purchaseId, {
          amount: (unpaid.get(value.purchase.purchaseId)?.amount || 0) - 1,
          purchase: value.purchase,
        });
        setUnpaid(unpaid2);
      }}
    >
      <span className="rounded-l py-4 pl-2 text-left transition group-hover:bg-blue-200 group-disabled:group-hover:bg-red-200">
        {value.purchase.item.displayName}
      </span>
      <span className="py-4 text-end transition group-hover:bg-blue-200 group-disabled:group-hover:bg-red-200">
        {value.amount}
      </span>
      <span className="rounded-r py-4 pr-2 text-end transition group-hover:bg-blue-200 group-disabled:group-hover:bg-red-200">
        {((value.amount * value.purchase.item.price) / 100).toFixed(2)}€
      </span>
    </button>
  );
};

export default UnpaidRow;
