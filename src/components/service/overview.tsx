import { type NextPage } from "next";
import Head from "next/head";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useState } from "react";
import type { ViewState } from "../../pages/service";
import { api } from "../../utils/api";

type Props = {
  viewState: {
    view: ViewState;
    setView: Dispatch<SetStateAction<ViewState>>;
  };
};

const ServiceOverview: NextPage<Props> = ({ viewState }) => {
  const categoriesQuery = api.categories.listCategories.useQuery();
  const [drinkCategories, setDrinkCategories] = useState<JSX.Element[]>();
  useEffect(() => {
    setDrinkCategories(
      categoriesQuery.data?.map((item) => (
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
  }, [categoriesQuery.data, categoriesQuery.dataUpdatedAt, viewState]);

  return (
    <>
      <Head>
        <title>MGAbiball</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700">
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Getränke
          </h1>
          <div className="grid grid-cols-1 gap-4 pb-16 sm:grid-cols-2 md:gap-8 md:pb-0">
            {drinkCategories}
          </div>
        </div>
      </main>
    </>
  );
};

export default ServiceOverview;
