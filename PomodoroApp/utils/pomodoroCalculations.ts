import { Task } from "@/db/models/Task";

interface PomodoroSettings {
    focusTime: number;
    breakTime: number;
    longBreakTime: number;
    intervals: number;
}


const getPomodoroDuration = (tasks : Task[], pomodoro_settings : PomodoroSettings = { focusTime: 25, breakTime: 5, longBreakTime: 15, intervals: 4 }) => {
    const totalEffort = tasks.reduce((acc, task) => acc + task.estimated_effort - task.real_effort, 0);
    const pomodoroDuration = pomodoro_settings.focusTime * pomodoro_settings.intervals + pomodoro_settings.breakTime * (pomodoro_settings.intervals - 1) + pomodoro_settings.longBreakTime;
    Math.ceil(totalEffort / pomodoroDuration);
}

export {getPomodoroDuration}