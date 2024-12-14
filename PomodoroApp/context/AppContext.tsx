import { createContext, useContext, ReactNode, useReducer, useEffect, useState,Dispatch,SetStateAction, useMemo } from "react";
import { reducer,AppState,PomodoroState,Action, ActionKind
 } from "./reducer";
import { useObject, useQuery, useRealm } from "@realm/react";
import { User } from "@/db/models/User";
import { Realm } from "@realm/react";
import {  createTaskController } from "../db/Controllers/TaskController";
import {  createUserController } from "../db/Controllers/UserController"; // Example
import {  createProjectController } from "../db/Controllers/ProjectController"; // Example
import {createListController} from "../db/Controllers/ListController";
import { createPomodoroController } from "@/db/Controllers/PomodoroController";
import { createSettingController } from "@/db/Controllers/SettingController";
// import { configureNotifications } from "@/utils/NotificationService";
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';


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
          PomodoroController: ReturnType<typeof createPomodoroController>;
          SettingController: ReturnType<typeof createSettingController>;
      };
  }

interface AppProviderProps {
    children: ReactNode;
  }

  const AppContext = createContext<AppContextType | undefined>(undefined);

  //Estado inicial del pomodoro



const AppContextProvider : React.FC<AppProviderProps> = ({ children }) => {
  
  
  
  const [user,setUser] = useState<User|null>(null);
    const realm = useRealm();
    const newUser = useQuery(User)[0];

    const {focus,shortBreak,longBreak,intervals} = newUser?.settings ? newUser.settings : {focus:25,shortBreak:5,longBreak:15,intervals:4}; 

    const initialState : AppState = {
      timer : focus,
      status: PomodoroState.FOCUS,
      nIntervals: 1,
      activeTask: "",
      currentPomodoro: "",
      params: {
          focusTime: focus,
          breakTime: shortBreak,
          longBreakTime: longBreak,
          intervals: intervals
      }
    }  
    const [state,dispatch] = useReducer(reducer,initialState);


    // Use useMemo to avoid recreating controllers on every render
    const controllers = useMemo(() => ({
      TaskController: createTaskController(user, realm),
      UserController: createUserController(realm),
      ProjectController: createProjectController(user, realm),
      ListController: createListController(user, realm),
      PomodoroController: createPomodoroController(user, realm),
      SettingController: createSettingController(user, realm),
  }), [user, realm]);

  const users = realm.objects("User");

  const onUserChange = () => {
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
        controllers.UserController.addUser("Mario","1234")
      }else{
        setUser(newUser)
      }  
    }
  },[user,realm])

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
  });

  useEffect(() => {
    const loadSavedStatus = async () => {

      console.log(state,"State...")
      let savedTimer = await AsyncStorage.getItem("timer").then((res) => {
        if (res) {
          return parseInt(res);
        }else{
          return state.timer
        }
      });
      let savedStatus = await AsyncStorage.getItem("status").then((res) => {
        if (res !== null && res !== "NaN") {
          return res
        }else{
          return state.status
        }
      });
      let savedNIntervals = await AsyncStorage.getItem("nIntervals").then((res) => {
        if (res) {
          return parseInt(res) ;
        }else{
          return state.nIntervals
        }
      });
      let savedActiveTask = await AsyncStorage.getItem("activeTask").then((res) => {
        if (res) {
          return res;
        }else{
          return state.activeTask
        }
      });
      let savedCurrentPomodoro = await AsyncStorage.getItem("currentPomodoro").then((res) => {
        if (res) {
          return res;
        }else{
          return state.currentPomodoro
        }

      });

      let savedSeconds = await AsyncStorage.getItem("seconds").then((res) => {
        if (res) {
          return parseInt(res);
        }else{
          return savedTimer
        }
      });

      console.log(savedTimer,savedSeconds);

      AsyncStorage.setItem("seconds",savedSeconds.toString());
      AsyncStorage.setItem("timer",savedTimer.toString());
      AsyncStorage.setItem("status",savedStatus.toString());
      AsyncStorage.setItem("nIntervals",savedNIntervals.toString());
      AsyncStorage.setItem("activeTask",savedActiveTask.toString());
      AsyncStorage.setItem("currentPomodoro",savedCurrentPomodoro.toString());

      if(savedTimer && savedStatus && savedNIntervals && savedActiveTask !== null && savedCurrentPomodoro !== null){
        dispatch({
          type: ActionKind.SET_INITIAL,
          payload: {
            timer: parseInt(savedTimer),
            status: savedStatus,
            nIntervals: parseInt(savedNIntervals),
            activeTask: savedActiveTask,
            currentPomodoro: savedCurrentPomodoro
          },
        });
      }
      
    }
    loadSavedStatus();
  },[])



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

