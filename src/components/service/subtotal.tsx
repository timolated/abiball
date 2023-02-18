import { type NextPage } from "next";
import type { Dispatch, SetStateAction } from "react";
import type { BasketState, ViewState } from "../../pages/service";

type Props = {
  changeView: Dispatch<SetStateAction<ViewState>>;
  basket: BasketState;
};

const ServiceSubtotal: NextPage<Props> = ({ basket, changeView }) => {
  let itemCount = 0;
  [...basket.items.values()].forEach((basketItem) => {
    itemCount += basketItem.count;
  });
  return (
    <div className="absolute bottom-2 right-2 left-2 flex flex-col gap-2 rounded-xl bg-gradient-to-b from-green-700 to-green-800 p-2 md:left-auto md:w-96">
      <div>
        <div className="font-bold text-white">
          {itemCount} {itemCount == 1 ? "Item" : "Items"}
        </div>
        {[...basket.items.values()].map((basketItem) => (
          <div
            key={basketItem.item.id}
            className="flex grow flex-row text-white"
          >
            <span className="grow">
              {basketItem.count}x {basketItem.item.displayName}
            </span>
            <span>
              {((basketItem.count * basketItem.item.price) / 100).toFixed(2)}€
            </span>
          </div>
        ))}
      </div>
      <div className="flex grow flex-row items-center ">
        <div className="relative grow font-bold text-white">
          <span className="before:absolute before:right-16 before:left-0 before:-top-1 before:block before:h-px  before:bg-white">
            Total: {(basket.total / 100).toFixed(2)}€
          </span>
        </div>
        {basket.items.size == 0 && (
          <button
            onClick={() => {
              if (basket.items.size == 0) return;
              changeView((state) => {
                return { ...state, type: "checkout" };
              });
            }}
            className="flex cursor-pointer items-center rounded-lg  bg-gray-400 p-2 px-4 align-middle text-gray-800"
          >
            Checkout
          </button>
        )}
        {basket.items.size > 0 && (
          <button
            onClick={() => {
              if (basket.items.size == 0) return;
              changeView((state) => {
                return { ...state, type: "checkout" };
              });
            }}
            className="flex cursor-pointer items-center rounded-lg bg-white p-2 px-4 align-middle "
          >
            Checkout
          </button>
        )}
      </div>
    </div>
  );
};

export default ServiceSubtotal;
