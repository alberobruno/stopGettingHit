import React, { createContext, useContext, useState } from "react";

const StateContext = createContext();

export const StateProvider = ({ children }) => {
  const [receivedData, setReceivedData] = useState(null);

  // You can add more state management logic here

  return (
    <StateContext.Provider value={{ receivedData, setReceivedData }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => useContext(StateContext);
