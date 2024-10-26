
// Reducer para realizar acciones referentes al pomodoro
enum ActionKind {
    SWITCH = "SWITCH",
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
    params: Params
}

const reducer = (state : AppState,action: Action
) => {
    switch(action.type){
        // Para cuando el reloj llegue a 0
        case  ActionKind.SWITCH:
            
            // Si el estado actual es diferente al de concentracion (Tiempo de descanso)
            if(state.status !== PomodoroState.FOCUS){
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
                return {...state,timer : newTimer, status: newStatus}
            }
    }
}

export {reducer,AppState,PomodoroState,Action
,ActionKind}