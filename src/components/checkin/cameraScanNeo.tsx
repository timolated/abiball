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
  const [ticketInputFieldValue, setTicketInputFieldValue] = useState("");
  const ticketExistsQuery = api.tickets.findTicket.useQuery({
    ticketId: result,
  });
  const ticketDisplayQuery = api.tickets.findTicket.useQuery({
    ticketId: ticketInputFieldValue,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

  useEffect(() => {
    if (ticketExistsQuery.data) {
      setTicket(ticketExistsQuery.data);
      changeView("info");
    } else if (!ticketExistsQuery.isLoading && result.trim() != "") {
      setResult("");
      changeView("info");
    }
  }, [
    changeView,
    result,
    setTicket,
    ticketExistsQuery.data,
    ticketExistsQuery.isLoading,
  ]);

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
            setTicketInputFieldValue(result.getText());
            setResult(result.getText());
          }
          if (error) return;
        }
      )
      .catch((error) => console.log(error));
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      reader.current.reset();
    };
  }, [changeView, setTicket, ticketExistsQuery.data, videoRef]);

  const handleManualTicketInput: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTicketInputFieldValue(e.target.value);
    if (e.target.value.trim() != "") setTicketInputFieldValue(e.target.value);
  };
  const handleManualSubmit: FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault();
    if (ticketInputFieldValue.trim() != "") setResult(ticketInputFieldValue);
  };
  return (
    <div className="flex flex-col gap-4 p-2">
      {ticketDisplayQuery.data && (
        <h1 className="text-2xl font-semibold text-white">
          {ticketDisplayQuery.data.holderName}
        </h1>
      )}
      <video className="max-w-full rounded-lg md:max-w-md" ref={videoRef} />
      <form onSubmit={handleManualSubmit}>
        <input
          type="text"
          autoFocus
          value={ticketInputFieldValue}
          onChange={handleManualTicketInput}
          placeholder="TicketId"
          className="text-center w-full max-w-md rounded-xl bg-white/20  p-2 text-4xl font-bold text-white placeholder-white/50 focus:outline-white"
        />
      </form>
    </div>
  );
};
export default CameraScanNeo;
