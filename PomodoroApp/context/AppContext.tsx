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
import { createPomodoroController } from "@/db/Controllers/PomodoroController";
interface AppContextType {
        state: AppState,
        dispatch : React.Dispatch<Action>
        user: User | null,
        setUser: Dispatch<SetStateAction<User | null>>,
        render: boolean,
        setRender: Dispatch<SetStateAction<boolean>>,
        controllers: {
          TaskController: ReturnType<typeof createTaskController>;
          UserController:  ReturnType<typeof createUserController>
          ProjectController: ReturnType<typeof createProjectController>;
          ListController: ReturnType<typeof createListController>;
          PomodoroController: ReturnType<typeof createPomodoroController>;
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
    activeTask: "",
    currentPomodoro: "",
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
    const [render,setRender] = useState<boolean>(false)

    // Use useMemo to avoid recreating controllers on every render
    const controllers = useMemo(() => ({
      TaskController: createTaskController(user, realm),
      UserController: createUserController(realm),
      ProjectController: createProjectController(user, realm),
      ListController: createListController(user, realm),
      PomodoroController: createPomodoroController(user, realm)
  }), [user, realm]);

  const newUser = useQuery(User)[0];
  const users = realm.objects("User");

  const onUserChange = () => {
    console.log("Change Detected");
    setUser(newUser);
  };

  try{
    users.addListener(onUserChange);
  }catch(error){
    console.error(error);
  }

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
        console.log('Realm path:', realm.path);
        setUser(newUser)
      }  
    }
  },[user,realm])


  useEffect(() => {
    console.log(render);
    
  },[render])

    return (
        <AppContext.Provider value={
          {state,
            dispatch,
            user,
            setUser,
            controllers,
            render,
            setRender
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

