import { type NextPage } from "next";
import type { ChangeEventHandler, Dispatch, SetStateAction } from "react";
import type { ViewState } from "../../../pages/service";
import { api } from "../../../utils/api";
import CameraScanNeo from "./cameraScanNeo";

type Props = {
  changeView: Dispatch<SetStateAction<ViewState>>;
  changePage: Dispatch<SetStateAction<"summary" | "scan" | "validation">>;
  ticket: {
    ticket: string;
    setTicket: Dispatch<SetStateAction<string>>;
  };
};

const CheckoutScan: NextPage<Props> = ({ changePage, ticket }) => {
  const ticketQuery = api.tickets.findTicket.useQuery({
    ticketId: ticket.ticket,
  });
  // useEffect(() => {}, [ticket.ticket])
  const handleTicketIdChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.trim() != "") ticket.setTicket(e.target.value);
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
        Ticket scannen
      </h1>
      <h2 className="text-3xl font-bold text-white">
        {ticketQuery.data?.holderName}
      </h2>
      <CameraScanNeo changePage={changePage} setTicket={ticket.setTicket} />
      <form
        onSubmit={() => {
          if (ticketQuery.data) changePage("validation");
        }}
      >
        <input
          type="text"
          autoFocus
          onChange={handleTicketIdChange}
          placeholder="TicketId"
          className="w-full max-w-md rounded-xl bg-white/20 p-2  text-center text-4xl font-bold text-white placeholder-white/50 focus:outline-white"
        />
      </form>
      <div className="mt-2 flex w-full max-w-md gap-2">
        <button
          onClick={() => {
            changePage("summary");
          }}
          className="flex grow cursor-pointer items-center justify-center rounded-lg bg-white p-2 px-4 align-middle"
        >
          Zurück
        </button>
        <button
          disabled={!ticketQuery.data}
          onClick={() => {
            if (ticketQuery.data) changePage("validation");
          }}
          className="flex grow-[4] cursor-pointer items-center justify-center rounded-lg bg-white p-2 px-4 align-middle disabled:bg-gray-400 disabled:text-gray-700"
        >
          Bestätigen
        </button>
      </div>
    </div>
  );
};

export default CheckoutScan;
