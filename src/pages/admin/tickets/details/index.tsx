import type { Item, Purchase } from "@prisma/client";
import type {
  RefetchOptions,
  RefetchQueryFilters,
  QueryObserverResult,
} from "@tanstack/react-query";
import { type NextPage } from "next";
import Head from "next/head";
import Link from "next/link";
import Router, { useRouter } from "next/router";
import type { ChangeEventHandler, FormEventHandler } from "react";
import { useState, useEffect } from "react";
import { api } from "../../../../utils/api";

const TicketDetailsPage: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    ticketId: string;
    holderName: string;
  }>({ ticketId: "", holderName: "" });
  const [ticketId, setTicketId] = useState("");

  const ticketQuery = api.tickets.findTicketWithPurchaseamount.useQuery(
    { ticketId: ticketId },
    { refetchOnWindowFocus: false }
  );
  const submitMutation = api.tickets.updateTicket.useMutation();

  useEffect(() => {
    if (router.isReady && typeof router.query.ticketId == "string") {
      setTicketId(router.query.ticketId);
    }
  }, [router.isReady, router.query.ticketId]);

  useEffect(() => {
    if (
      ticketId &&
      ticketQuery.isLoading == false &&
      ticketQuery.data != null
    ) {
      setFormData({
        ticketId: ticketQuery.data?.ticketId,
        holderName: ticketQuery.data?.holderName,
      });
    }
  }, [
    ticketId,
    ticketQuery.data,
    ticketQuery.dataUpdatedAt,
    ticketQuery.isLoading,
  ]);

  const handleTicketIdChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, ticketId: event.target.value });
  };
  const handleHolderNameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, holderName: event.target.value });
  };

  const handleEventSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (formData.ticketId.trim() == "") return;
    submitMutation
      .mutateAsync({
        ticketId: ticketId,
        newTicketId: formData.ticketId.trim(),
        holderName:
          formData.holderName.trim() != ""
            ? formData.holderName.trim()
            : "Anonym",
      })
      .then((res) => {
        if (res) {
          Router.back();
        } else {
          console.log("error trying to update ticket");
        }
      })
      .catch((error) => console.error(error));
  };

  // löschlogik
  const [deleteError, setDeleteError] = useState(
    <span className="rounded bg-black p-2 font-semibold text-red-700">
      Das Löschen löscht gleichzeitig alle Käufe, die mit diesem Ticket getätigt
      wurden.
    </span>
  );
  const [confirmPopup, setConfirmed] = useState(false);
  const deleteTicketMutation = api.tickets.deleteTicket.useMutation();
  const handleDeleteRequest = () => {
    if (!confirmPopup) setConfirmed(true);
    else {
      deleteTicketMutation
        .mutateAsync({ ticketId: ticketId })
        .then((res) => {
          if (res) {
            Router.back();
          } else {
            console.log("error trying to delete ticket");
            setDeleteError(
              <span className="rounded bg-black p-2 font-semibold text-red-700">
                Löschen nicht möglich
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
      <main className="flex h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700 p-4">
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
        <div className="flex max-h-screen w-full max-w-5xl flex-col items-center justify-center gap-12 px-4 py-16 ">
          <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
            Ticket: {ticketId}
          </h1>
          <div className="contents w-full flex-row items-start gap-2 md:flex">
            {ticketId.trim() != "" && (
              <div className="flex w-full  max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition ">
                {formData && (
                  <form
                    className="flex w-full flex-col gap-2"
                    onSubmit={handleEventSubmit}
                  >
                    <label className="-mb-2 text-sm font-bold">
                      TicketId / Barcode
                    </label>
                    <input
                      type="text"
                      name="ticketId"
                      placeholder="TicketId / Barcode"
                      value={formData.ticketId}
                      onChange={handleTicketIdChange}
                      className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                    />
                    <label className="-mb-2 text-sm font-bold">
                      Ticketinhaber
                    </label>
                    <input
                      type="text"
                      name="holderName"
                      value={formData.holderName}
                      placeholder="Name des Inhabers"
                      onChange={handleHolderNameChange}
                      className="rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                    />
                    <input
                      disabled={submitMutation.isLoading}
                      type="submit"
                      value="Speichern"
                      className="cursor-pointer rounded-lg bg-black bg-opacity-70 p-2  font-semibold text-white placeholder-gray-700 disabled:bg-opacity-20"
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
                      className="animate-pulse rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
                    />
                    <label className="-mb-2 text-sm font-bold">
                      Ticketinhaber
                    </label>
                    <input
                      disabled
                      type="text"
                      placeholder="Name des Inhabers"
                      className="animate-pulse rounded-lg bg-white bg-opacity-70 p-2 font-semibold text-black placeholder-gray-700"
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
                  className="w-full rounded-lg bg-red-800 bg-opacity-90 p-2  font-semibold text-white placeholder-gray-700 disabled:bg-opacity-20"
                  onClick={handleDeleteRequest}
                >
                  Löschen
                </button>
              </div>
            )}

            {ticketId.trim() != "" && ticketQuery.data?.purchases && (
              <div className="flex w-full flex-col gap-2 rounded-xl bg-white/10 p-2 text-white transition">
                <div className="flex flex-row gap-4 px-2 text-lg font-bold">
                  <div>
                    Summe:{" "}
                    {(
                      ticketQuery.data?.purchases.reduce(
                        (i, j) => i + j.item.price * j.quantity,
                        0
                      ) / 100
                    ).toFixed(2)}
                    €
                  </div>
                  <div className="font-normal">
                    Offen:{" "}
                    {(
                      ticketQuery.data?.purchases.reduce(
                        (i, j) => i + j.item.price * (j.quantity - j.paid),
                        0
                      ) / 100
                    ).toFixed(2)}
                    €
                  </div>
                </div>
                <div className="grid max-h-full grid-cols-[1fr_64px_64px_32px] overflow-auto">
                  <div className="pl-2 font-bold">Getränk</div>
                  <div className="pr-4 text-end font-bold">Anzahl</div>
                  <div className="pr-6 text-end font-bold">Bezahlt</div>
                  <div className="pr-6 text-end font-bold"></div>
                  {ticketQuery.data?.purchases.map((item) => (
                    <PurchaseRow
                      key={item.purchaseId}
                      item={item}
                      refetch={ticketQuery.refetch}
                    />
                  ))}
                </div>
              </div>
            )}
            {ticketId.trim() != "" && ticketQuery.isLoading && (
              <div className="flex w-full flex-col gap-2 rounded-xl bg-white/10 p-2 text-white transition ">
                <div className="flex flex-row items-center gap-2 px-2 text-lg font-bold">
                  Summe:
                  <div className="inline-block h-6 w-12 animate-pulse rounded bg-white/20 text-end text-xl font-semibold" />
                </div>
                <div className="flex flex-row items-center gap-2 px-2 text-lg font-bold">
                  Offen:
                  <div className="inline-block h-6 w-12 animate-pulse rounded bg-white/20 text-end text-xl font-semibold" />
                </div>
                <div className="grid max-h-full grid-cols-[1fr_64px_64px] gap-2 overflow-auto">
                  <div className="pl-2 font-bold">Getränk</div>
                  <div className="pr-4 text-end font-bold">Anzahl</div>
                  <div className="pr-6 text-end font-bold">Bezahlt</div>
                  <div className="h-6 w-4/5 animate-pulse rounded bg-white/20 pl-2" />
                  <div className="ml-auto mr-4 h-6 w-2/3 animate-pulse rounded bg-white/20 text-end text-xl font-semibold" />
                  <div className="ml-auto mr-4 h-6 w-2/3 animate-pulse rounded bg-white/20 pr-2 text-end text-xl font-semibold" />
                  <div className="h-6 w-4/5 animate-pulse rounded bg-white/20 pl-2" />
                  <div className="ml-auto mr-4 h-6 w-2/3 animate-pulse rounded bg-white/20 text-end text-xl font-semibold" />
                  <div className="ml-auto mr-4 h-6 w-2/3 animate-pulse rounded bg-white/20 pr-2 text-end text-xl font-semibold" />
                </div>
              </div>
            )}
          </div>
          {ticketId.trim() == "" && (
            <Link
              href="/admin/tickets/create"
              className="group flex  w-full max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition "
            >
              <p>Es gibt kein Ticket mit der Identifikation.</p>
              <p className="group-hover:underline">Neues Ticket anlegen?</p>
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

type purchaseRowProps = {
  item: Purchase & {
    item: Item;
  };
  refetch: <TPageData>(
    options?: RefetchOptions & RefetchQueryFilters<TPageData>
  ) => Promise<QueryObserverResult>;
};

const PurchaseRow: NextPage<purchaseRowProps> = ({ item, refetch }) => {
  const [purchaseState, setPurchaseState] = useState({
    quantity: item.quantity,
    paid: item.paid,
    outOfSync: false,
  });

  const updateMutation = api.purchases.updatePurchase.useMutation();
  const deleteMutation = api.purchases.removePurchase.useMutation();

  return (
    <div className="group contents" data-outOfSync={purchaseState.outOfSync}>
      <abbr
        className="grow rounded-l pl-2 text-xl no-underline transition-colors group-hover:bg-white/20 group-data-[outOfSync=true]:bg-red-500/80"
        title={`${(item.item.price / 100).toFixed(2)}€/stück`}
      >
        {item.itemId}
      </abbr>
      <input
        type="number"
        className="w-full bg-transparent text-end text-xl font-semibold transition-colors group-hover:bg-white/20 group-data-[outOfSync=true]:bg-red-500/80"
        value={purchaseState.quantity}
        min={purchaseState.paid}
        max={99}
        onChange={(e) => {
          const value = parseInt(e.target.value);

          if (purchaseState.paid <= value && value > 0 && value < 100) {
            setPurchaseState({
              quantity: value,
              paid: purchaseState.paid,
              outOfSync: false,
            });
            // update db
            updateMutation
              .mutateAsync({
                purchaseId: item.purchaseId,
                quantity: value,
              })
              .then(() => refetch()) // update total
              .catch((error) => console.error(error));
          } else {
            setPurchaseState({
              quantity: value,
              paid: purchaseState.paid,
              outOfSync: true,
            });
          }
        }}
      />
      <input
        type="number"
        className="w-full rounded-r bg-transparent pr-2 text-end text-xl font-semibold transition-colors group-hover:bg-white/20 group-data-[outOfSync=true]:bg-red-500/80"
        value={purchaseState.paid}
        min={0}
        max={purchaseState.quantity}
        onChange={(e) => {
          const value = parseInt(e.target.value);

          if (0 <= value && value <= purchaseState.quantity) {
            setPurchaseState({
              quantity: purchaseState.quantity,
              paid: value,
              outOfSync: false,
            });
            // update db
            updateMutation
              .mutateAsync({
                purchaseId: item.purchaseId,
                paid: value,
              })
              .then(() => refetch()) // update offen
              .catch((error) => console.error(error));
          } else {
            setPurchaseState({
              quantity: purchaseState.quantity,
              paid: value,
              outOfSync: true,
            });
          }
        }}
      />
      <button
        className="ml-1 rounded transition-colors hover:bg-red-500"
        onClick={() => {
          deleteMutation
            .mutateAsync({ purchaseId: item.purchaseId })
            .then(() => refetch())
            .catch((error) => console.error(error));
        }}
      >
        🗑️
      </button>
    </div>
  );
};

export default TicketDetailsPage;
