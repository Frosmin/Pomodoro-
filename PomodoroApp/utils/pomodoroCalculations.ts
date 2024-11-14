import { Task } from "@/db/models/Task";
import { AppState,PomodoroState } from "@/context/reducer";


const getPomodoroDuration = (tasks : Task[], pomodoro_state : AppState) => {
    const totalEffort = tasks.reduce((acc, task) => acc + task.estimated_effort - task.real_effort, 0);
    const {params, nIntervals, status} = pomodoro_state;

    let intervalsLeft = nIntervals + totalEffort;
    if(status === PomodoroState.FOCUS) {
        intervalsLeft--;
    }
    let sessionsLeft = Math.floor((intervalsLeft) / params.intervals);
    if(intervalsLeft % params.intervals !== 0) {
        sessionsLeft++;
    }
    const longsBreaksLeft = sessionsLeft - 1;
    const shortBreaksLeft = intervalsLeft - longsBreaksLeft - 1;
    const durationLeftInSeconds = totalEffort * params.focusTime + shortBreaksLeft * params.breakTime + longsBreaksLeft * params.longBreakTime;
    
    const pomodoroEndTime = new Date(Date.now() - (4 * 60 * 60 * 1000) + durationLeftInSeconds * 1000 ).toISOString().split('T')[1].split('.')[0];
    
    return {
        pomodorosLeft : totalEffort,
        pomodoroEndTime}

}

export {getPomodoroDuration}