import { createContext, useContext, ReactNode } from "react";

interface AppContextType {
        data : string
  }

interface AppProviderProps {
    children: ReactNode;
  }

  const AppContext = createContext<AppContextType | undefined>(undefined);


const AppProvider : React.FC<AppProviderProps> = ({ children }) => {
    return (
        <AppContext.Provider value={{data : "hello"}}>{children}</AppContext.Provider>
    );
}

const useGlobalContext = () => {
    return useContext(AppContext);
}

export { AppContext, AppProvider, useGlobalContext };

