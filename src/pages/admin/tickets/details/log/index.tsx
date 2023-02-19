import { type NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import { api } from "../../../../../utils/api";

const TicketDetailsPage: NextPage = () => {
  const router = useRouter();
  const [ticketId, setTicketId] = useState("");

  const ticketQuery = api.tickets.getTickeLog.useQuery(
    { ticketId: ticketId },
    { refetchOnWindowFocus: false }
  );

  useEffect(() => {
    if (router.isReady && typeof router.query.ticketId == "string") {
      setTicketId(router.query.ticketId);
    }
  }, [router.isReady, router.query.ticketId]);

  return (
    <>
      <Head>
        <title>Logfile: {ticketId}</title>
      </Head>
      <div className="">
        <h1>Ticket: {ticketId}</h1>
        {!ticketQuery.data && !ticketQuery.isLoading && <span>No data.</span>}
        {ticketId.trim() != "" && ticketQuery.data?.purchasesLog && (
          <div className="">
            <div className="font-bold">
              Total:{" "}
              {(
                ticketQuery.data?.purchasesLog.reduce(
                  (i, j) => i + j.item.price * j.quantity,
                  0
                ) / 100
              ).toFixed(2)}
              €
            </div>
            {ticketQuery.data?.purchasesLog.map((item) => {
              return (
                <div
                  key={item.purchaseId}
                  className="flex grow flex-row justify-between gap-8"
                >
                  <span className="grow">
                    {item.quantity}x {item.itemId}
                  </span>
                  <span>
                    ({item.quantity}x {(item.item.price / 100).toFixed(2)}€){" "}
                    {((item.quantity * item.item.price) / 100).toFixed(2)}€
                  </span>
                  <span>
                    {item.timestamp.toLocaleString("de-DE", {
                      timeZone: "Europe/Berlin",
                    })}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        {ticketId.trim() == "" && <p>Ticket not found.</p>}
      </div>
    </>
  );
};

export default TicketDetailsPage;
