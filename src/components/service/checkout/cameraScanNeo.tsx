import type { NextPage } from "next";
import { BrowserMultiFormatReader } from "@zxing/library";
import type { Dispatch, SetStateAction } from "react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../../utils/api";

type Props = {
  changePage: Dispatch<SetStateAction<"summary" | "scan" | "validation">>;
  setTicket: Dispatch<SetStateAction<string>>;
};

const CameraScanNeo: NextPage<Props> = ({ changePage, setTicket }) => {
  const [enableCamera, setEnableCamera] = useState(false);
  const [result, setResult] = useState("");
  const ticketExistsQuery = api.tickets.findTicket.useQuery({
    ticketId: result,
  });

  const videoRef = useRef<HTMLVideoElement>(null);
  const reader = useRef(new BrowserMultiFormatReader());

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
            setResult(result.getText());
            setTicket(result.getText());
            console.log(result); //debug
          }
          if (error) return;
        }
      )
      .catch((error) => console.error(error));
    return () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      reader.current.reset();
    };
  }, [setTicket, videoRef, enableCamera]);

  // change page if ticket is actual ticket
  useEffect(() => {
    if (ticketExistsQuery.data) {
      changePage("validation");
    }
  }, [changePage, ticketExistsQuery.data]);

  return (
    <>
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
    </>
  );
};
export default CameraScanNeo;
