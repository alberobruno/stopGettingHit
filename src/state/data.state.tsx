import React, { createContext, useContext, useState, ReactNode } from "react";

interface IAppState {
  receivedData: unknown; 
  setReceivedData: React.Dispatch<React.SetStateAction<unknown>>; 
}

const StateContext = createContext<IAppState | undefined>(undefined);

type StateProviderProps = {
  children?: ReactNode;
}

export const StateProvider = ({ children }: StateProviderProps) => {
  const [receivedData, setReceivedData] = useState(null); 

  return (
    <StateContext.Provider value={{ receivedData, setReceivedData }}>
      {children}
    </StateContext.Provider>
  );
};

export const useAppState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAppState must be used within a StateProvider');
  }
  return context;
}
