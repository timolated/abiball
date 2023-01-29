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

const TicketDetailsPage: NextPage = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<{
    ticketId?: number;
    holderName?: string;
  }>({});
  const [ticketId, setTicketId] = useState(0);

  const ticketQuery = api.tickets.findTicket.useQuery({ ticketId: ticketId });
  const purchasesQuery = api.purchases.listPurchases.useQuery({
    buyerId: ticketId,
  });
  console.log(ticketId, ticketQuery.data);
  const submitMutation = api.tickets.updateTicket.useMutation();

  useEffect(() => {
    if (router.isReady && typeof router.query.ticketId == "string") {
      setTicketId(parseInt(router.query.ticketId));
    }
  }, [router.isReady]);

  useEffect(() => {
    if (
      ticketId != 0 &&
      ticketQuery.isLoading == false &&
      ticketQuery.data == null
    ) {
      setTicketId(-1);
    }
    if (
      ticketId > 0 &&
      ticketQuery.isLoading == false &&
      ticketQuery.data != null
    ) {
      setFormData({
        ticketId: ticketQuery.data?.ticketId,
        holderName: ticketQuery.data?.holderName,
      });
    }
  }, [ticketQuery.dataUpdatedAt]);

  const handleTicketIdChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, ticketId: parseInt(event.target.value) });
  };
  const handleHolderNameChange: ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    setFormData({ ...formData, holderName: event.target.value });
  };

  const handleEventSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    submitMutation
      .mutateAsync({
        ticketId: ticketId,
        newTicketId: formData.ticketId,
        holderName: formData.holderName,
      })
      .then((res) => {
        if (res) {
          Router.back();
        } else {
          console.log("error trying to update ticket");
        }
      });
  };

  // useEffect(() => {
  //   purchasesQuery.data
  // }, [purchasesQuery.dataUpdatedAt])

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
            Ticket: {ticketId}
          </h1>
          {ticketId != -1 && (
            <div className="flex w-full  max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition ">
              {formData.ticketId && (
                <form
                  className="flex w-full flex-col gap-2"
                  onSubmit={handleEventSubmit}
                >
                  <label className="-mb-2 text-sm font-bold">
                    TicketId / Barcode
                  </label>
                  <input
                    type="number"
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
          {ticketId > 0 && (
            <div className="flex w-full  max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition ">
              <>Purchases: {purchasesQuery.data}</>
            </div>
          )}
          {ticketId == -1 && (
            <Link
              href="/admin/tickets/create"
              className="group flex  w-full max-w-sm flex-col items-center gap-4 rounded-xl bg-white/10 p-4 text-white transition "
            >
              <p>Es gibt kein Ticket mit der Nummer.</p>
              <p className="group-hover:underline">Neues Ticket anlegen?</p>
            </Link>
          )}
        </div>
      </main>
    </>
  );
};

export default TicketDetailsPage;
