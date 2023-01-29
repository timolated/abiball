import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { ViewState } from ".";
import { api } from "../../utils/api";

type Props = {
  viewState: {
    view: ViewState;
    setView: Dispatch<SetStateAction<ViewState>>;
  };
};

const ServiceOverview: NextPage<Props> = ({ viewState }) => {
  const categoriesQuery = api.categories.listCategories.useQuery();
  const [drinkCategories, setDrinkCategories] = useState<any>();
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
          {/* <span className="text-9xl">{category.icon??🍷}</span> */}
          <span className="text-9xl">🍷</span>
          <span className="text-2xl font-semibold">{item.displayName}</span>
        </button>
      ))
    );
  }, [categoriesQuery.dataUpdatedAt]);

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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {drinkCategories}
          </div>
        </div>
      </main>
    </>
  );
};

export default ServiceOverview;
