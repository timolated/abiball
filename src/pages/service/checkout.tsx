import { type NextPage } from "next";
import {
  ChangeEventHandler,
  Dispatch,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { BasketState, ViewState } from ".";
import CheckoutScan from "./checkout/scan";
import CheckoutSummary from "./checkout/summary";
import CheckoutValidation from "./checkout/validation";

type Props = {
  changeView: Dispatch<SetStateAction<ViewState>>;
  changeBasket: Dispatch<SetStateAction<BasketState>>;
  basket: BasketState;
};

const ServiceCheckout: NextPage<Props> = ({
  basket,
  changeView,
  changeBasket,
}) => {
  const [chekcoutpage, setChekcoutpage] = useState<
    "summary" | "scan" | "validation"
  >("summary");
  const [ticketId, setTicketId] = useState<number>(0);

  return (
    <>
      {chekcoutpage == "summary" && (
        <CheckoutSummary
          basket={basket}
          changeView={changeView}
          changeBasket={changeBasket}
          changePage={setChekcoutpage}
        />
      )}
      {/* changePage={setChekcoutpage} */}
      {chekcoutpage == "scan" && (
        <CheckoutScan
          changeView={changeView}
          changePage={setChekcoutpage}
          ticket={{ ticket: ticketId, setTicket: setTicketId }}
        />
      )}
      {chekcoutpage == "validation" && (
        <CheckoutValidation
          basket={basket}
          changeView={changeView}
          changeBasket={changeBasket}
          changePage={setChekcoutpage}
          ticket={ticketId}
        />
      )}
    </>
  );
};

export default ServiceCheckout;
