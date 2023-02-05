import { Ticket } from "@prisma/client";
import { NextPage } from "next";
import { useState } from "react";
import CameraScanNeo from "./cameraScanNeo";
import CheckInTicketPage from "./checkin";

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
      {view == "info" && !ticket && <>Wrong ticket</>}
    </div>
  );
};

export default CheckInPage;
