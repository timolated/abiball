import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "../../../utils/api";

const CategoryOverview: NextPage = () => {
  const categoriesQuery = api.categories.listCategories.useQuery();
  const [drinkCategories, setDrinkCategories] = useState<JSX.Element[]>();
  useEffect(() => {
    if (categoriesQuery.data)
      setDrinkCategories(
        categoriesQuery.data.map((category) => (
          <Link
            href={`/admin/drinks?category=${category.id}`}
            key={category.id}
            className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
          >
            <span className="text-9xl">{category.icon ?? <>🍷</>}</span>
            <span className="text-2xl font-semibold">
              {category.displayName}
            </span>
          </Link>
        ))
      );
  }, [categoriesQuery.data, categoriesQuery.dataUpdatedAt]);

  return (
    <>
      <Head>
        <title>MGAbiball</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700 p-4">
        <Link href={"/admin/"} className="absolute top-2 left-2 cursor-pointer">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 p-2 text-3xl">
            🔙
          </div>
        </Link>
        <div className="container flex flex-col items-center justify-center gap-4">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Kategorien
          </h1>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-8">
            {drinkCategories}
            {!categoriesQuery.data && categoriesQuery.isLoading && (
              <div className="flex max-w-sm cursor-pointer flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20">
                <span className="animate-spin text-9xl">🤔</span>
                <span className="text-2xl font-semibold">Lade...</span>
              </div>
            )}
            {categoriesQuery.error && (
              <div className="flex max-w-sm cursor-not-allowed flex-col items-center gap-4 rounded-xl bg-red-600 p-4 text-white transition hover:bg-red-900">
                <span className="text-9xl">🚫</span>
                <span className="text-2xl font-semibold">
                  Fehler beim Laden
                </span>
              </div>
            )}
            <Link
              href="/admin/drinks/createCategory"
              className="flex max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition hover:bg-white/20"
            >
              <span className="text-9xl">🆕</span>
              <span className="text-2xl font-semibold">Neue Kategorie</span>
            </Link>
          </div>
        </div>
      </main>
    </>
  );
};

export default CategoryOverview;
