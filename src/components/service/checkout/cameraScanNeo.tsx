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
  const [result, setResult] = useState("");
  const ticketExistsQuery = api.tickets.findTicket.useQuery({
    ticketId: result,
  });

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
  }, [setTicket, videoRef]);

  // change page if ticket is actual ticket
  useEffect(() => {
    if (ticketExistsQuery.data) {
      changePage("validation");
    }
  }, [changePage, ticketExistsQuery.data]);

  return (
    <>
      <video className="max-w-md rounded-lg" ref={videoRef} />
    </>
  );
};
export default CameraScanNeo;
