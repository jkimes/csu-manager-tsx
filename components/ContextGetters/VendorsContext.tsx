import React, { createContext, useState, useContext } from "react";

export const VendorsContext = createContext<any | undefined>(undefined);

export function useVendorsContext() {
  const data = useContext(VendorsContext);

  if (data === undefined) {
    throw new Error("useDataContext must be used with a DataContext");
  }
  return data;
}

// Create a provider component
export const VendorsProvider = ({ children }) => {
  const [data, setData] = useState(/* initial data */);

  // Function to update data
  const updateData = (newData) => {
    setData(newData);
  };
};
