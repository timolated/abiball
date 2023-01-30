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
    icon: "",
    price: 0,
    categoryId: "",
    parentId: "",
  });
  const currentDrinkQuery = api.drinks.listDrinks.useQuery(
    {
      id: drink?.toString(),
    },
    { refetchOnWindowFocus: false }
  );
  const categoriesQuery = api.categories.listCategories.useQuery();
  const [drinkCategories, setDrinkCategories] = useState<any>();
  const parentDrinksQuery = api.drinks.listDrinks.useQuery({});
  const [parentDrinks, setParentDrinks] = useState<any>();
  useEffect(() => {
    if (currentDrinkQuery.data) {
      const drinkData = currentDrinkQuery.data[0];
      setFormData({
        id: drinkData?.id || "",
        displayName: drinkData?.displayName || "",
        icon: drinkData?.icon || "",
        price: drinkData?.price || 0,
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

  const handleIdChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setFormData({ ...formData, id: event.target.value });
  };
  const handleDisplayNameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, displayName: event.target.value });
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

  const submitMutation = api.drinks.updateDrink.useMutation();
  const handleEventSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (!drink) return;
    if (formData.displayName.trim() == "") return;
    if (formData.id.trim() == "") return;
    console.log(formData);
    submitMutation
      .mutateAsync({
        ...formData,
        id: drink.toString(),
        newId: formData.id.trim(),
        icon: formData.icon.trim() != "" ? formData.icon.trim() : undefined,
        parentId:
          formData.parentId.trim() != "" ? formData.parentId.trim() : undefined,
      })
      .then((res) => {
        if (res) {
          Router.back();
        } else {
          console.log("error trying to update drink");
        }
      });
  };

  // löschlogik
  const [deleteError, setDeleteError] = useState(
    <span className="rounded bg-black p-2 font-semibold text-red-700">
      Das Löschen löscht gleichzeitig Varianten dieses Getränks!
    </span>
  );
  const [confirmPopup, setConfirmed] = useState(false);
  const deleteDrinkMutation = api.drinks.deleteDrink.useMutation();
  const handleDeleteRequest = () => {
    if (!confirmPopup) setConfirmed(true);
    else {
      if (!drink) return;
      deleteDrinkMutation.mutateAsync({ id: drink.toString() }).then((res) => {
        if (res) {
          Router.back();
        } else {
          console.log("error trying to delete drink");
          setDeleteError(
            <span className="rounded bg-black p-2 font-semibold text-red-700">
              Löschen nicht möglich. Das Getränk wurde vermutlich bereits
              gekauft
            </span>
          );
        }
      });
    }
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
                  <label className="-mb-2 text-sm font-bold">Anzeige</label>
                  <div className="flex flex-row gap-2">
                    <input
                      type="text"
                      onChange={handleDisplayNameChange}
                      value={formData.displayName}
                      placeholder="Displayname"
                      className="grow rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                    />
                    <input
                      type="text"
                      onChange={handleIconChange}
                      value={formData.icon}
                      placeholder="Icon"
                      className="w-20 rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                    />
                  </div>
                  {/* Icon */}
                  <label className="-mb-2 text-sm font-bold">Preis in ct</label>
                  <input
                    type="number"
                    onChange={handlePriceChange}
                    value={formData.price}
                    placeholder="Preis in cent"
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
              <button
                className="w-full max-w-md rounded-lg bg-red-800 bg-opacity-90 p-2  font-semibold text-white placeholder-gray-700 disabled:bg-opacity-20"
                onClick={handleDeleteRequest}
              >
                Löschen
              </button>
            </div>
          )}
          {drink && (
            <div className="flex w-full max-w-md flex-col gap-4">
              <DrinkTable mode="drink" parentId={drink.toString()} />
              <Link
                href={`/admin/drinks/new?category=${
                  formData.categoryId
                }&parentId=${drink?.toString()}`}
                className="flex h-full w-full max-w-md flex-col gap-1 overflow-auto rounded-xl bg-white/10  p-4 hover:bg-white/20"
              >
                <div className="text-center font-bold text-white">
                  Neue Variante 🍹
                </div>
              </Link>
            </div>
          )}
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

export default DrinkDetailsPage;
