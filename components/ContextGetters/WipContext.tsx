import React, { createContext, useState, useContext } from "react";

export const WipContext = createContext<any | undefined>(undefined);

// Create a provider component
export const WipProvider = ({ children }) => {
  const [data, setData] = useState(/* initial data */);

  // Function to update data
  const updateData = (newData) => {
    setData(newData);
  };
};
