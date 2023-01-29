import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import {
  useState,
  ChangeEventHandler,
  FormEventHandler,
  useEffect,
} from "react";
import { api } from "../../../../utils/api";
import DrinkTable from "../drinkTable";

const DrinkDetailsPage: NextPage = () => {
  const router = useRouter();
  const drink = router.query.drink;
  const [formData, setFormData] = useState({
    id: "",
    displayName: "",
    price: 0,
    barcode: 0,
    categoryId: "",
    parentId: "",
  });
  const currentDrinkQuery = api.drinks.listDrinks.useQuery({
    id: drink?.toString(),
  });
  const categoriesQuery = api.categories.listCategories.useQuery();
  const [drinkCategories, setDrinkCategories] = useState<any>();
  const parentDrinksQuery = api.drinks.listDrinks.useQuery({});
  const [parentDrinks, setParentDrinks] = useState<any>();
  const childDrinksQuery = api.drinks.listDrinks.useQuery({
    parentId: drink?.toString(),
  });
  const [childDrinks, setChildDrinks] = useState<any>();
  useEffect(() => {
    if (currentDrinkQuery.data) {
      const drinkData = currentDrinkQuery.data[0];
      setFormData({
        id: drinkData?.id || "",
        displayName: drinkData?.displayName || "",
        price: drinkData?.price || 0,
        barcode: drinkData?.barcode || 0,
        categoryId: drinkData?.categoryId || "",
        parentId: drinkData?.parentId || "",
      });
    }
  }, [currentDrinkQuery.dataUpdatedAt]);
  useEffect(() => {
    setDrinkCategories(
      categoriesQuery.data?.map((item) => (
        <option key={item.id} value={item.id}>
          {item.displayName}
        </option>
      ))
    );
  }, [categoriesQuery.dataUpdatedAt]);
  useEffect(() => {
    if (parentDrinksQuery.data) {
      const possibleParentDrinks = parentDrinksQuery.data?.filter(
        (pDrink) =>
          pDrink.categoryId == formData.categoryId && pDrink.id != drink
      );
      setParentDrinks(
        possibleParentDrinks.map((item) => (
          <option key={item.id} value={item.id}>
            {item.displayName}
          </option>
        ))
      );
    }
  }, [parentDrinksQuery.dataUpdatedAt, formData.categoryId]);
  useEffect(() => {
    if (childDrinksQuery.data) {
      setChildDrinks(
        childDrinksQuery.data.map((item) => (
          <div className=" contents" key={item.id}>
            <Link
              href={`/admin/drinks/details?drink=${item.id}`}
              key={item.id}
              className="grid cursor-pointer grid-cols-5 rounded px-2 hover:bg-blue-200"
            >
              <div>{item.id}</div>
              <div>{item.displayName}</div>
              <div>{item.barcode}</div>
              <div>{item.price}</div>
              <div>{item.parentId}</div>
            </Link>
            {/* {children.length > 0 && (
                <div className="grid-cols-5">{children.length} weitere...</div>
              )} */}
          </div>
        ))
      );
    }
  }, [childDrinksQuery.dataUpdatedAt]);

  const handleIdChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, id: event.target.value });
  };
  const handleDisplayNameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, displayName: event.target.value });
  };
  const handlePriceChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, price: parseInt(event.target.value) });
  };
  const handleBarcodeChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, barcode: parseInt(event.target.value) });
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

  const submitMutation = api.drinks.updateDrink.useMutation();
  const handleEventSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    submitMutation
      .mutateAsync({
        ...formData,
        id: drink?.toString() || formData.id,
        newId: formData.id,
      })
      .then((res) => {
        if (res) {
          Router.back();
        } else {
          console.log("error trying to update drink");
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
            {formData.displayName}
          </h1>
          {drink && (
            <div className="flex w-full  max-w-md flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition ">
              {formData.displayName && (
                <form
                  className="flex w-full flex-col gap-2"
                  onSubmit={handleEventSubmit}
                >
                  <label className="-mb-2 text-sm font-bold">
                    Identifikationsname
                  </label>
                  <input
                    required
                    onChange={handleIdChange}
                    value={formData.id}
                    type="text"
                    placeholder="Id"
                    className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                  />
                  <label className="-mb-2 text-sm font-bold">Anzeigename</label>
                  <input
                    required
                    onChange={handleDisplayNameChange}
                    value={formData.displayName}
                    type="text"
                    placeholder="Display Name"
                    className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                  />
                  <label className="-mb-2 text-sm font-bold">Preis in ct</label>
                  <input
                    type="number"
                    onChange={handlePriceChange}
                    value={formData.price}
                    placeholder="Preis in cent"
                    className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                  />
                  <label className="-mb-2 text-sm font-bold">Barcode</label>
                  <input
                    type="number"
                    onChange={handleBarcodeChange}
                    placeholder="Barcode"
                    className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                  />
                  <>
                    <label className="-mb-2 text-sm font-bold">Kategorie</label>
                    <input
                      type="text"
                      value={formData.categoryId}
                      onChange={handleCategoryChange}
                      required
                      placeholder="Kategorie"
                      list="drink-categories"
                      className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                    />
                    <datalist id="drink-categories">{drinkCategories}</datalist>
                  </>
                  <>
                    <label className="-mb-2 text-sm font-bold">
                      Obergetränk
                    </label>
                    <input
                      type="text"
                      value={formData.parentId}
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
              )}
              {!formData && (
                <form className="flex w-full flex-col gap-2">
                  <label className="-mb-2 text-sm font-bold">
                    TicketId / Barcode
                  </label>
                  <input
                    type="number"
                    disabled
                    placeholder="TicketId / Barcode"
                    className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                  />
                  <label className="-mb-2 text-sm font-bold">
                    Ticketinhaber
                  </label>
                  <input
                    disabled
                    type="text"
                    placeholder="Name des Inhabers"
                    className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                  />
                  <input
                    disabled
                    type="submit"
                    value="Speichern"
                    className="rounded-lg bg-black bg-opacity-70  p-2 font-semibold text-white placeholder-gray-700"
                  />
                </form>
              )}
            </div>
          )}
          {drink && <DrinkTable mode="drink" parentId={drink.toString()} />}
          {currentDrinkQuery.data == null && (
            <Link
              href="/admin/drinks/"
              className="group flex  w-full max-w-md flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition "
            >
              <p>Es gibt das gesuchte Getränk nicht.</p>
              <p className="group-hover:underline">Zur Übersicht</p>
            </Link>
          )}
        </div>
      </main>
    </>
  );
};

export default DrinkDetailsPage;
