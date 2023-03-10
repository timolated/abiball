import { type NextPage } from "next";
import Head from "next/head";
import Router from "next/router";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useState } from "react";
import { api } from "../../../../utils/api";

const Home: NextPage = () => {
  const [formData, setFormData] = useState<{
    ticketId?: string;
    holderName?: string;
  }>({});
  const [error, setError] = useState(false);

  const handleTicketIdChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.target.value.trim() != "")
      setFormData({ ...formData, ticketId: event.target.value });
  };
  const handleHolderNameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, holderName: event.target.value });
  };

  const submitMutation = api.tickets.createTicket.useMutation();

  const handleEventSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    submitMutation
      .mutateAsync({
        ...formData,
        holderName: formData.holderName?.trim() || "Anonym",
      })
      .then((res) => {
        if (res) {
          setError(false);
          Router.back();
        } else {
          setError(true);
          console.log("error trying to create ticket");
        }
      })
      .catch((error) => console.error(error));

    setFormData({ ...formData, holderName: "" });
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
            Ticket erstellen
          </h1>
          <div className="flex w-full  max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition ">
            <form
              className="flex w-full flex-col gap-2"
              onSubmit={handleEventSubmit}
            >
              <input
                type="text"
                name="ticketId"
                placeholder="TicketId / Barcode"
                onChange={handleTicketIdChange}
                autoFocus
                className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
              />
              <input
                type="text"
                name="holderName"
                placeholder="Name des Inhabers"
                onChange={handleHolderNameChange}
                className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
              />
              {!submitMutation.isLoading && (
                <input
                  type="submit"
                  value="Erstellen"
                  className="rounded-lg bg-black bg-opacity-70  p-2 font-semibold text-white placeholder-gray-700"
                />
              )}
              {submitMutation.isLoading && (
                <input
                  type="submit"
                  value="..."
                  disabled
                  className="animate-pulse rounded-lg bg-black bg-opacity-70  p-2 font-semibold text-white placeholder-gray-700"
                />
              )}
              {error && (
                <span className="rounded-lg bg-red-600 p-2 font-bold text-black">
                  Fehler beim erstellen des Tickets
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
