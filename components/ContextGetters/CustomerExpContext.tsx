import React, { createContext, useState, useContext } from "react";

export const CustomerExpContext = createContext<any | undefined>(undefined);

export function useDataContext() {
  const data = useContext(CustomerExpContext);

  if (data === undefined) {
    throw new Error("useDataContext must be used with a DataContext");
  }
  return data;
}

// Create a provider component
export const DataProvider = ({ children }) => {
  const [data, setData] = useState(/* initial data */);

  // Function to update data
  const updateData = (newData) => {
    setData(newData);
  };
};