import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import {
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
  useState,
} from "react";
import { api } from "../../../../utils/api";

const NewDrinkPage: NextPage = () => {
  const router = useRouter();
  const category = router.query.category;
  const parentId = router.query.parentId;
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    category: category?.toString(),
    parent: parentId?.toString(),
  });
  const categoriesQuery = api.categories.listCategories.useQuery();
  const [drinkCategories, setDrinkCategories] = useState<any>();
  const parentDrinksQuery = api.drinks.listDrinks.useQuery({});
  const [parentDrinks, setParentDrinks] = useState<any>();
  useEffect(() => {
    setDrinkCategories(
      categoriesQuery.data?.map((item) => (
        <option value={item.id}>{item.displayName}</option>
      ))
    );
  }, [categoriesQuery.dataUpdatedAt]);
  useEffect(() => {
    if (parentDrinksQuery.data) {
      // let parentDrinks = parentDrinksQuery.data?.filter(
      //   (drink) => drink.parentId == null
      // );
      let parentDrinks = parentDrinksQuery.data;
      if (formData.category) {
        parentDrinks = parentDrinks?.filter(
          (drink) => drink.categoryId == formData.category
        );
      }
      setParentDrinks(
        parentDrinksQuery.data?.map((item) => (
          <option value={item.id}>{item.displayName}</option>
        ))
      );
    }
  }, [parentDrinksQuery.dataUpdatedAt, formData.category]);

  const handleNameChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, name: event.target.value });
  };
  const handlePriceChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, price: parseInt(event.target.value) });
  };
  const handleCategoryChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, category: event.target.value });
  };
  const handleParentDrinkChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, parent: event.target.value });
  };

  const createDrinkMutation = api.drinks.createDrink.useMutation();
  const handleEventSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!formData.name) return;
    if (!formData.category) return;
    if (!formData.price && !formData.parent) return;
    createDrinkMutation
      .mutateAsync({
        ...formData,
        category: formData.category,
      })
      .then((res) => {
        if (res) {
          router.push(`/admin/drinks?category=${formData.category}`);
        } else {
          console.log("error trying to create category");
        }
      });
  };

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
            Getränk hinzufügen
          </h1>
          <div className="flex w-full  max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition ">
            <form
              onSubmit={handleEventSubmit}
              className="flex w-full flex-col gap-2 "
            >
              <input
                required
                onChange={handleNameChange}
                type="text"
                placeholder="Name"
                className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
              />
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
              {parentId && (
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
              )}
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
