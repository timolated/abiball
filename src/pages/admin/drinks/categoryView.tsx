import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import { useState } from "react";
import { api } from "../../../utils/api";
import DrinkTable from "./drinkTable";

type Props = {
  categoryId: string;
};

const CategoryView: NextPage<Props> = ({ categoryId }) => {
  const categoryNameQuery = api.categories.getCategoryName.useQuery({
    categoryId,
  });

  // löschlogik
  const [deleteError, setDeleteError] = useState(
    <span className="rounded bg-black p-2 font-semibold text-red-700">
      Das Löschen löscht gleichzeitig Getränke dieser Kategorie!
    </span>
  );
  const [confirmPopup, setConfirmed] = useState(false);
  const deleteCategoryMutation = api.categories.deleteCategory.useMutation();
  const handleDeleteRequest = () => {
    if (!confirmPopup) setConfirmed(true);
    else {
      deleteCategoryMutation
        .mutateAsync({ id: categoryId })
        .then((res) => {
          if (res != "error") {
            Router.back();
          } else {
            console.log("error trying to delete category");
            setDeleteError(
              <span className="rounded bg-black p-2 font-semibold text-red-700">
                Löschen nicht möglich. Die Kategorie hat noch Getränke
              </span>
            );
          }
        })
        .catch((error) => console.error(error));
    }
  };

  return (
    <>
      <Head>
        <title>MGAbiball</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700 p-4">
        <Link
          href="/admin/drinks"
          className="absolute top-2 left-2 cursor-pointer"
        >
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 p-2 text-3xl">
            🔙
          </div>
        </Link>
        <div className="container flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            {categoryNameQuery.data?.displayName}
          </h1>

          <div className="flex w-full max-w-md flex-col gap-2">
            <Link
              href={`/admin/drinks/new?category=${categoryId}`}
              className="flex h-full w-full max-w-md flex-col gap-1 overflow-auto rounded-xl bg-white/10  p-4 hover:bg-white/20"
            >
              <div className="text-center font-bold text-white">
                Neues Getränk 🍹
              </div>
            </Link>

            <button
              className="w-full max-w-md rounded-lg bg-red-800 bg-opacity-90 p-2  font-semibold text-white placeholder-gray-700 disabled:bg-opacity-20"
              onClick={handleDeleteRequest}
            >
              Löschen
            </button>
          </div>

          <DrinkTable mode="category" categoryId={categoryId} />
        </div>
      </main>
      {confirmPopup && (
        <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-80">
          <div className="container flex max-w-sm flex-col gap-4 rounded-2xl bg-gray-500 p-8">
            <h1 className="text-3xl font-bold text-white">
              Löschen bestätigen
            </h1>
            {deleteError}
            <button
              onClick={() => setConfirmed(false)}
              className="grow rounded-lg bg-white bg-opacity-90 p-2  font-semibold text-black placeholder-gray-700 disabled:bg-opacity-20"
            >
              Abbrechen
            </button>
            <button
              onClick={handleDeleteRequest}
              className="rounded-lg bg-red-800 bg-opacity-90 p-2  font-semibold text-white placeholder-gray-700 disabled:bg-opacity-20"
            >
              Unwiderruflich Löschen
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryView;
