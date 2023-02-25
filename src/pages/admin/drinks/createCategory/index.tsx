import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router from "next/router";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useState } from "react";
import { api } from "../../../../utils/api";

const Home: NextPage = () => {
  const [formData, setFormData] = useState<{
    displayName: string;
    icon: string;
  }>({ displayName: "", icon: "" });
  const [error, setError] = useState(false);

  const handleDisplayNameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, displayName: event.target.value });
  };
  const handleIconChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, icon: event.target.value });
  };

  const createCategoryMutation = api.categories.createCategory.useMutation();

  const handleEventSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (formData.displayName.trim() == "") return;
    createCategoryMutation
      .mutateAsync({
        displayName: formData.displayName.trim(),
        icon: formData.icon.trim() != "" ? formData.icon.trim() : undefined,
      })
      .then((res) => {
        if (res) {
          setError(false);
          void Router.push("/admin/drinks");
        } else {
          setError(true);
          console.error("error trying to create category");
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  return (
    <>
      <Head>
        <title>MGAbiball</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700 p-4">
        <Link href="/admin/drinks" className="absolute top-2 left-2">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 p-2 text-3xl">
            🔙
          </div>
        </Link>
        <div className="container flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Kategorie hinzufügen
          </h1>
          <div className="flex w-full  max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition ">
            <form
              onSubmit={handleEventSubmit}
              className="flex w-full flex-col gap-2 "
            >
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  onChange={handleDisplayNameChange}
                  placeholder="Name"
                  className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                />
                <input
                  type="text"
                  onChange={handleIconChange}
                  placeholder="Icon"
                  className="min-w-0 rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                />
              </div>
              {!createCategoryMutation.isLoading && (
                <input
                  type="submit"
                  value="Speichern"
                  className="rounded-lg bg-black bg-opacity-70  p-2 font-semibold text-white placeholder-gray-700"
                />
              )}
              {createCategoryMutation.isLoading && (
                <input
                  type="submit"
                  value="..."
                  disabled
                  className="animate-pulse rounded-lg bg-black bg-opacity-70  p-2 font-semibold text-white placeholder-gray-700"
                />
              )}
              {error && (
                <span className="rounded-lg bg-red-600 p-2 font-bold text-black">
                  Fehler beim erstellen der Kategorie
                </span>
              )}
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
