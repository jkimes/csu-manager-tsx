import { createContext, useContext, useState } from "react";

export const PaymentContext = createContext<any[] | undefined>(undefined);

export function usePaymentContext() {
  const payments = useContext(PaymentContext);

  if (payments === undefined) {
    throw new Error("useQuoteContext must be used with a QuoteContext");
  }

  return payments;
}
export const PaymentProvider = ({ children }) => {
    const [data, setData] = useState(/* initial data */);
  
    // Function to update data
    const updateData = (newData) => {
      setData(newData);
    };
  };