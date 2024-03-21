import { createContext, useContext } from "react";

export const QuoteContext = createContext<any[] | undefined>(undefined);

export function useQuoteContext() {
  const quotes = useContext(QuoteContext);

  if (quotes === undefined) {
    throw new Error("useQuoteContext must be used with a QuoteContext");
  }
  return quotes;
}
