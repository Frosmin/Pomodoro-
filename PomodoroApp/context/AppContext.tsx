import { createContext, useContext, ReactNode, useReducer } from "react";
import { reducer,AppState,PomodoroState,Action
 } from "./reducer";
 import realm from "@/db";

interface AppContextType {
        state: AppState,
        dispatch : React.Dispatch<Action>

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


const AppProvider : React.FC<AppProviderProps> = ({ children }) => {
    const [state,dispatch] = useReducer(reducer,initialState);
    return (
        <AppContext.Provider value={{state,dispatch}}>{children}</AppContext.Provider>
    );
}

const useGlobalContext = () => {
    const context = useContext(AppContext);
  if (!context) {
    throw new Error('useGlobalContext must be used within an AppProvider');
  }
  return context;
}

export { AppContext, AppProvider, useGlobalContext };

