import type { Ticket } from "@prisma/client";
import type { NextPage } from "next";

type Props = {
  ticket: Ticket;
};

const TicketCard: NextPage<Props> = ({ ticket }) => {
  return (
    <div className="flex w-full max-w-full flex-col rounded-xl bg-gray-900 text-white md:max-w-md">
      <div className="bg-blur-lg flex grow flex-col rounded-l-xl p-2">
        <span className="my-4 text-2xl font-semibold">{ticket.holderName}</span>
        <span className="text-lg font-bold text-gray-300">
          Abiball Abivengers {new Date().toLocaleDateString()}
        </span>
        <span className="text-sm font-semibold tracking-widest text-gray-300">
          Mariengymnasium Bocholt
        </span>
      </div>
      <div className="flex justify-center rounded-b-lg bg-gray-50 p-2 text-black">
        <span className="text-center font-['Libre_Barcode_128_Text'] text-6xl">
          {ticket.ticketId}
        </span>
      </div>
    </div>
  );
};
export default TicketCard;
