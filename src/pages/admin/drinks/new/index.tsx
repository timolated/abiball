import { type NextPage } from "next";
import Head from "next/head";
import Router, { useRouter } from "next/router";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useEffect, useState } from "react";
import { api } from "../../../../utils/api";

const NewDrinkPage: NextPage = () => {
  const router = useRouter();
  const category = router.query.category;
  const parentId = router.query.parentId;
  const [formData, setFormData] = useState<{
    name: string;
    price: number;
    icon: string;
    categoryId: string | undefined;
    parentId: string | undefined;
  }>({
    name: "",
    price: 0,
    icon: "",
    categoryId: category?.toString(),
    parentId: parentId?.toString(),
  });
  const categoriesQuery = api.categories.listCategories.useQuery();
  const [drinkCategories, setDrinkCategories] = useState<JSX.Element[]>();
  const parentDrinksQuery = api.drinks.listDrinks.useQuery({});
  const [parentDrinks, setParentDrinks] = useState<JSX.Element[]>();
  useEffect(() => {
    setDrinkCategories(
      categoriesQuery.data?.map((item) => (
        <option key={item.id} value={item.id}>
          {item.displayName}
        </option>
      ))
    );
  }, [categoriesQuery.data, categoriesQuery.dataUpdatedAt]);
  useEffect(() => {
    if (parentDrinksQuery.data) {
      setParentDrinks(
        parentDrinksQuery.data?.map((item) => (
          <option key={item.id} value={item.id}>
            {item.displayName}
          </option>
        ))
      );
    }
  }, [
    parentDrinksQuery.dataUpdatedAt,
    formData.categoryId,
    parentDrinksQuery.data,
  ]);

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, name: event.target.value });
  };
  const handleIconChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, icon: event.target.value });
  };
  const handlePriceChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, price: parseInt(event.target.value) });
  };
  const handleCategoryChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, categoryId: event.target.value });
  };
  const handleParentDrinkChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, parentId: event.target.value });
  };

  const createDrinkMutation = api.drinks.createDrink.useMutation();
  const handleEventSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    console.log(formData);
    if (formData.name.trim() == "") return;
    if (!formData.categoryId) return;
    if (formData.price == undefined && !formData.parentId) return;
    createDrinkMutation
      .mutateAsync({
        ...formData,
        name: formData.name.trim(),
        price: formData.price ?? 0,
        categoryId: formData.categoryId,
        icon: formData.icon.trim() == "" ? formData.icon : undefined,
      })
      .then((res) => {
        if (res) {
          router.back();
          // router.push(`/admin/drinks?category=${formData.categoryId}`);
        } else {
          console.log("error trying to create drink");
        }
      })
      .catch((error) => console.error(error));
  };

  return (
    <>
      <Head>
        <title>MGAbiball</title>
        <meta name="description" content="" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700 p-4">
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
        <div className="container flex flex-col items-center justify-center gap-4">
          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Getränk hinzufügen
          </h1>
          <div className="flex w-full  max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition ">
            <form
              onSubmit={handleEventSubmit}
              className="flex w-full flex-col gap-2 "
            >
              <div className="flex flex-row gap-2">
                <input
                  type="text"
                  onChange={handleNameChange}
                  placeholder="Name"
                  className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                />
                <input
                  type="text"
                  onChange={handleIconChange}
                  placeholder="Icon/Emoji"
                  className="min-w-0 rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                />
              </div>
              <input
                type="number"
                onChange={handlePriceChange}
                placeholder="Preis in cent"
                className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
              />
              <>
                <input
                  type="text"
                  defaultValue={category}
                  onChange={handleCategoryChange}
                  required
                  placeholder="Kategorie"
                  list="drink-categories"
                  className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                />
                <datalist id="drink-categories">{drinkCategories}</datalist>
              </>
              <>
                <input
                  type="text"
                  defaultValue={parentId}
                  onChange={handleParentDrinkChange}
                  placeholder="Obergetränk"
                  list="parent-drinks"
                  className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                />
                <datalist id="parent-drinks">{parentDrinks}</datalist>
              </>
              <input
                type="submit"
                value="Speichern"
                className="rounded-lg bg-black bg-opacity-70  p-2 font-semibold text-white placeholder-gray-700"
              />
            </form>
          </div>
        </div>
      </main>
    </>
  );
};

export default NewDrinkPage;
