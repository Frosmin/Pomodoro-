import { Task, TaskStatus } from "@/db/models/Task";
import { AppState,PomodoroState } from "@/context/reducer";



const getPomodoroDuration = (tasks : Task[], pomodoro_state : AppState) => {
    let totalEffort = 0;
    let realEffort = 0;
    let totalPomodoros = 0;
    tasks.forEach(task => {
        if(task.status === TaskStatus.FINISHED) {
            totalEffort += 0;
            realEffort += task.estimated_effort;
        } else {
            totalEffort += task.estimated_effort - task.real_effort;
            realEffort += task.real_effort;
        }
        totalPomodoros += task.estimated_effort;

    });
    const {params, nIntervals, status} = pomodoro_state;
    console.log(nIntervals,totalEffort,status);

    let intervalsLeft = totalEffort;
    if(status === PomodoroState.FOCUS) {
        intervalsLeft--;
    }
    let sessionsLeft = Math.floor((nIntervals%params.intervals + intervalsLeft) / params.intervals);
    if(nIntervals % params.intervals === 0) {
        sessionsLeft++;
    }
    const longsBreaksLeft = sessionsLeft ;
    const shortBreaksLeft = intervalsLeft - longsBreaksLeft ;
    const durationLeftInSeconds = totalEffort * params.focusTime + shortBreaksLeft * params.breakTime + longsBreaksLeft * params.longBreakTime;
    console.log(durationLeftInSeconds,"Duration Left",longsBreaksLeft,shortBreaksLeft,intervalsLeft);
    const pomodoroEndTime = new Date(Date.now() - (4 * 60 * 60 * 1000) + durationLeftInSeconds * 1000 ).toISOString().split('T')[1].split('.')[0];
    
    return {
        donePomodoros : realEffort,
        totalPomodoros ,
        pomodoroEndTime}

}

export {getPomodoroDuration}