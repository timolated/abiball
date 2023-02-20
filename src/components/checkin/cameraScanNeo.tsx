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
  const [enableCamera, setEnableCamera] = useState(false);
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
      setResult("");
      setTicket(ticketExistsQuery.data);
      changeView("info");
    } else if (!ticketExistsQuery.isLoading && result.trim() != "") {
      setResult("");
      setTicket(undefined);
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
    if (!enableCamera) return;
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
  }, [changeView, setTicket, ticketExistsQuery.data, videoRef, enableCamera]);

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
      {!enableCamera && !ticketExistsQuery.isLoading && (
        <button
          onClick={() => setEnableCamera(true)}
          className="flex h-80 w-full max-w-full flex-col items-center justify-center gap-4 rounded-lg bg-white/20 md:max-w-md"
        >
          <span className="text-9xl">📷</span>
          <span className="text-xl font-semibold text-white">
            Kamera aktivieren
          </span>
        </button>
      )}
      {enableCamera && !ticketExistsQuery.isLoading && (
        <video className="max-w-full rounded-lg md:max-w-md" ref={videoRef} />
      )}
      {ticketExistsQuery.isLoading && (
        <div className="flex h-80 w-full max-w-full items-center justify-center rounded-lg bg-white/20 md:max-w-md">
          <span className="animate-spin text-9xl">🥳</span>
        </div>
      )}
      <form onSubmit={handleManualSubmit}>
        <input
          type="text"
          autoFocus
          value={ticketInputFieldValue}
          onChange={handleManualTicketInput}
          placeholder="TicketId"
          className="w-full max-w-md rounded-xl bg-white/20 p-2  text-center text-4xl font-bold text-white placeholder-white/50 focus:outline-white"
        />
      </form>
    </div>
  );
};
export default CameraScanNeo;
