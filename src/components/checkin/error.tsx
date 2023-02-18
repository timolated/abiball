import type { NextPage } from "next";
import type { Dispatch, SetStateAction } from "react";
import { useEffect } from "react";

type Props = {
  changeView: Dispatch<SetStateAction<"scan" | "info">>;
};

const CheckInError: NextPage<Props> = ({ changeView }) => {
  useEffect(() => {
    setTimeout(() => {
      changeView("scan");
    }, 2000);
  }, [changeView]);
  return (
    <div className="flex w-full max-w-full flex-col rounded-xl bg-red-700 text-white md:max-w-md">
      <div className="bg-blur-lg flex grow flex-col rounded-l-xl p-2">
        <span className="my-4 text-2xl font-semibold">
          Dieses Ticket existiert nicht
        </span>
        <span className="text-lg font-bold text-gray-300">
          Abiball Abivengers {new Date().toLocaleDateString()}
        </span>
        <span className="text-sm font-semibold tracking-widest text-gray-300">
          Mariengymnasium Bocholt
        </span>
      </div>
    </div>
  );
};
export default CheckInError;
