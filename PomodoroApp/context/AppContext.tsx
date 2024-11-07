import { createContext, useContext, ReactNode, useReducer, useEffect, useState,Dispatch,SetStateAction } from "react";
import { reducer,AppState,PomodoroState,Action
 } from "./reducer";
 import realm from "@/db";
import { useObject, useRealm } from "@realm/react";
import { User } from "@/db/models/User";

interface AppContextType {
        state: AppState,
        dispatch : React.Dispatch<Action>
        user: User | null,
        setUser: Dispatch<SetStateAction<User | null>>,

  }

interface AppProviderProps {
    children: ReactNode;
  }

  const AppContext = createContext<AppContextType | undefined>(undefined);

  //Estado inicial del pomodoro
const initialState : AppState = {
    timer : 25,
    status: PomodoroState.FOCUS,
    nIntervals: 1,
    params: {
        focusTime: 25,
        breakTime: 5,
        longBreakTime: 15,
        intervals:4
    }
}


const AppContextProvider : React.FC<AppProviderProps> = ({ children }) => {
    const [user,setUser] = useState<User|null>(null);
    const [state,dispatch] = useReducer(reducer,initialState);

    useEffect(() => {
      console.log(user,"user");
    },[])
    return (
        <AppContext.Provider value={{state,dispatch,user,setUser}}>{children}</AppContext.Provider>
    );
}

const useGlobalContext = () => {
    const context = useContext(AppContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within an AppProvider');
  }
  return context;
}

export { AppContext, AppContextProvider, useGlobalContext };

