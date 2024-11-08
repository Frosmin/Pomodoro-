import { createContext, useContext, ReactNode, useReducer, useEffect, useState,Dispatch,SetStateAction, useMemo } from "react";
import { reducer,AppState,PomodoroState,Action
 } from "./reducer";
import { useObject, useQuery, useRealm } from "@realm/react";
import { User } from "@/db/models/User";
import { Realm } from "@realm/react";
import {  createTaskController } from "../db/Controllers/TaskController";
import {  createUserController } from "../db/Controllers/UserController"; // Example
import {  createProjectController } from "../db/Controllers/ProjectController"; // Example
import {createListController} from "../db/Controllers/ListController";
interface AppContextType {
        state: AppState,
        dispatch : React.Dispatch<Action>
        user: User | null,
        setUser: Dispatch<SetStateAction<User | null>>,
        controllers: {
          TaskController: ReturnType<typeof createTaskController>;
          UserController:  ReturnType<typeof createUserController>
          ProjectController: ReturnType<typeof createProjectController>;
          ListController: ReturnType<typeof createListController>;
      };
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
    const realm = useRealm();

    // Use useMemo to avoid recreating controllers on every render
    const controllers = useMemo(() => ({
      TaskController: createTaskController(user, realm),
      UserController: createUserController(realm),
      ProjectController: createProjectController(user, realm),
      ListController: createListController(user, realm)
  }), [user, realm]);

  const newUser = useQuery(User)[0];

  useEffect(() => {
    // if(realm){
    //   realm.write(() => {
    //     realm.deleteAll();
    //     console.log("delete All");
    //   });
    // }
    
    if(!user){    
      if(!newUser){
        console.log("creating User");
        
        controllers.UserController.addUser("Mario","1234")
      }else{
        console.log("setting User");
        
        setUser(newUser)
      }  
    }
  },[user,realm])
    return (
        <AppContext.Provider value={
          {state,
            dispatch,
            user,
            setUser,
            controllers,
          }}>{children}</AppContext.Provider>
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

