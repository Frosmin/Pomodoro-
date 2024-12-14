import AsyncStorage from '@react-native-async-storage/async-storage';
import Setting from "@/db/models/Setting";


// Reducer para realizar acciones referentes al pomodoro
enum ActionKind {
    SWITCH = "SWITCH",
    SET_CURRENT = "SET_CURRENT",
    SET_POMODORO = "START_POMODORO",
    SET_PARAMS = "SET_PARAMS",
    SET_INITIAL = "SET_INITIAL"
}

interface Action
 {
    type: ActionKind,
    payload?: any
}

enum PomodoroState{
    FOCUS = "FOCUS",
    BREAK = "BREAK",
    LONG_BREAK = "LONG BREAK"
}
interface Params{
    focusTime : number,
    breakTime : number,
    longBreakTime: number,
    intervals: number,
}

interface AppState{
    timer : number,
    nIntervals: number,
    status: PomodoroState,
    params: Params,
    activeTask: string,
    currentPomodoro: string,
    settings?: Setting,
}

const reducer = (state : AppState,action: Action
) => {
    switch(action.type){
        // Para cuando el reloj llegue a 0
        case  ActionKind.SWITCH:
            
            // Si el estado actual es diferente al de concentracion (Tiempo de descanso)
            if(state.status !== PomodoroState.FOCUS){
                AsyncStorage.setItem("timer", state.timer.toString());
                AsyncStorage.setItem("status",PomodoroState.FOCUS);
                AsyncStorage.setItem("nIntervals", (state.nIntervals + 1).toString());
                return {
                    ...state,
                    timer: state.params.focusTime, 
                    status : PomodoroState.FOCUS,
                    nIntervals: state.nIntervals + 1
                }
            }else{
                // Si el estado actual es de Concentracion
                let newTimer = state.params.breakTime;
                let newStatus = PomodoroState.BREAK;
                //Comparar para ver si no han pasado ya los intervalos antes del descanso largo
                if(state.nIntervals % state.params.intervals === 0){
                    
                    // Asignar el nuevo tiempo del temporizador al del descanso largo
                    newTimer = state.params.longBreakTime
                    newStatus = PomodoroState.LONG_BREAK;
                }
                console.log(newTimer,newStatus,"Switghing");
                AsyncStorage.setItem("timer", newTimer.toString());
                AsyncStorage.setItem("status", newStatus);
                
                return {...state,timer : newTimer, status: newStatus}
            }
        case ActionKind.SET_CURRENT:
            AsyncStorage.setItem("activeTask",action.payload);
            return {...state,activeTask: action.payload};
        case ActionKind.SET_POMODORO:
            AsyncStorage.setItem("currentPomodoro",action.payload);
            return {...state, currentPomodoro: action.payload};
        case ActionKind.SET_PARAMS:
            console.log(action.payload);
            return {...state, timer: action.payload.focusTime,params: action.payload};
        case ActionKind.SET_INITIAL:
            return {...state, ...action.payload};
        }
}

export {reducer,AppState,PomodoroState,Action
,ActionKind, Params}