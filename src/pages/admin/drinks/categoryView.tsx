import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api";
import DrinkTable from "./drinkTable";

type Props = {
  categoryId: string;
};

const CategoryView: NextPage<Props> = ({ categoryId }) => {
  const categoryNameQuery = api.categories.getCategoryName.useQuery({
    categoryId,
  });
  return (
    <>
      <Head>
        <title>MGAbiball</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700">
        <div
          onClick={() => {
            Router.back();
          }}
          className="absolute top-2 left-2 cursor-pointer"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 p-2 text-3xl">
            🔙
          </div>
        </div>
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            {categoryNameQuery.data?.displayName}
          </h1>

          <Link
            href={`/admin/drinks/new?category=${categoryId}`}
            className="flex h-full w-full max-w-md flex-col gap-1 overflow-auto rounded-xl bg-white/10  p-4 hover:bg-white/20"
          >
            <div className="text-center font-bold text-white">
              Neues Getränk 🍹
            </div>
          </Link>

          <DrinkTable mode="category" categoryId={categoryId} />
        </div>
      </main>
    </>
  );
};

export default CategoryView;
