import type { NextPage } from "next";
import { BrowserMultiFormatReader } from "@zxing/library";
import type {
  ChangeEventHandler,
  Dispatch,
  FormEventHandler,
  SetStateAction,
} from "react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../utils/api";
import type { Ticket } from "@prisma/client";

type Props = {
  changeView: Dispatch<SetStateAction<"scan" | "info">>;
  setTicket: Dispatch<SetStateAction<Ticket | undefined>>;
};

const CameraScanNeo: NextPage<Props> = ({ changeView, setTicket }) => {
  const [result, setResult] = useState("");
  const ticketExistsQuery = api.tickets.findTicket.useQuery({
    ticketId: result,
  });
  const [ticketInputField, setTicketInputField] = useState("");

  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (!videoRef.current) return;
    reader.current
      .decodeFromConstraints(
        {
          audio: false,
          video: {
            facingMode: "environment",
          },
        },
        videoRef.current,
        (result, error) => {
          if (result) {
            setResult(result.getText());
            console.log(result); //debug
          }
          if (error) return;
        }
      )
      .catch((error) => console.log(error));
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      reader.current.reset();
    };
  }, [videoRef]);

  // change page if ticket is actual ticket
  useEffect(() => {
    if (ticketExistsQuery.data) {
      setTicket(ticketExistsQuery.data);
      changeView("info");
    }
  }, [changeView, setTicket, ticketExistsQuery.data]);

  const handleManualTicketInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.value.trim() != "") setTicketInputField(e.target.value);
  };
  const handleManualSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    setResult(ticketInputField);
    return;
  };
  return (
    <div className="flex flex-col gap-4">
      <video className="max-w-md rounded-lg" ref={videoRef} />
      <form onSubmit={handleManualSubmit}>
        <input
          type="text"
          autoFocus
          onChange={handleManualTicketInput}
          placeholder="TicketId"
          className="w-full max-w-md rounded-xl bg-white/20 p-2  text-center text-4xl font-bold text-white placeholder-white/50 focus:outline-white"
        />
      </form>
    </div>
  );
};
export default CameraScanNeo;
