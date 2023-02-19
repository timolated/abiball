import type { Ticket } from "@prisma/client";
import type { NextPage } from "next";
import { useState } from "react";
import CameraScanNeo from "../../components/checkin/cameraScanNeo";
import CheckInTicketPage from "../../components/checkin/checkin";
import CheckInError from "../../components/checkin/error";

const CheckInPage: NextPage = () => {
  const [view, setView] = useState<"scan" | "info">("scan");
  const [ticket, setTicket] = useState<Ticket | undefined>();
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-blue-600 to-violet-700">
      {view == "scan" && (
        <CameraScanNeo setTicket={setTicket} changeView={setView} />
      )}
      {view == "info" && ticket && (
        <CheckInTicketPage changeView={setView} ticket={ticket} />
      )}
      {view == "info" && !ticket && <CheckInError changeView={setView} />}
    </div>
  );
};

export default CheckInPage;
