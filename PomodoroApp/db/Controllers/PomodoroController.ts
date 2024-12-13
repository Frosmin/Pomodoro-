import Realm from "realm";
import {User} from "../models/User";
import { Pomodoro ,PomodoroStatus} from "../models/Pomodoro";
import { PomodoroState } from "@/context/reducer";


export enum DisctractionType {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL",
}

const createPomodoroController = (user: User | null, realm: Realm | null) => {
    const addPomodoro = (task_id: string,minutes: number) => {
        

        if (!realm || !user) {
            return { status: "error", message: "Missing user or realm", pomodoro_id: new Realm.BSON.ObjectId(0) };
        }

        try {
            let pomodoro_id = new Realm.BSON.ObjectId();
            const realm_task_id = task_id !== "" ? new Realm.BSON.ObjectId(task_id) : new Realm.BSON.ObjectId(0);

            realm.write(() => {
                while (user.pomodoros[pomodoro_id.toString()]) {
                    pomodoro_id = new Realm.BSON.ObjectId();
                }
                const newPomodoro = realm.create<Pomodoro>('Pomodoro', Pomodoro.generate(pomodoro_id,minutes,realm_task_id));
                user.pomodoros[newPomodoro._id.toString()] = newPomodoro;
            });
            return { status: "success", message: "Pomodoro added successfully", pomodoro_id };
        } catch (error) {
            console.error("Error adding pomodoro:", error);
            return { status: "error", message: "Failed to add pomodoro", pomodoro_id: new Realm.BSON.ObjectId(0) };
        }
    };

    const changePomodoroStatus = (pomodoro_id: string, status: PomodoroStatus) => {
        if (!realm || !user) {
            console.log("Error updating pomodoro");
            return {message:"Error updating pomodoro",type:"error", pomodoro_id: new Realm.BSON.ObjectId(0)};
        }
        const pomodoro_id_realm = new Realm.BSON.ObjectId(pomodoro_id);
        realm.write(() => {
            const pomodoro = user.pomodoros[pomodoro_id_realm.toString()];
            if (pomodoro.status) {
                pomodoro.status = status;
            }
        });
        return {message:"Pomodoro updated successfully",type:"success",pomodoro_id};
    }

    const scoreDistraccion = (pomodoro_id: string, type: DisctractionType) => {
        if (!realm || !user) {
            console.log("Error updating pomodoro");
            return {message:"Error updating pomodoro",type:"error", pomodoro_id};
        }
        const pomodoro_id_realm = new Realm.BSON.ObjectId(pomodoro_id);
        realm.write(() => {
            const pomodoro = user.pomodoros[pomodoro_id];
            if (type === DisctractionType.INTERNAL) {
                pomodoro.internal_distraction++;
            }else{
                pomodoro.external_distraction++;
            }
        }); 
        return {message:"Pomodoro updated successfully",type:"success",pomodoro_id};
    }

    const getDailyPomodoros = (date: Date) => {
        if(!realm || !user || Object(user?.pomodoros).length === 0){
            return {message: "Error during getting pomodoros", type: "error", data: {}}
        }

        
        
        const pomodoros = Object.values(user.pomodoros).filter((pomodoro) => {
            const pomodoroDate = new Date(pomodoro.started_at);
            return pomodoroDate.getDate() === date.getDate() && pomodoroDate.getMonth() === date.getMonth() && pomodoroDate.getFullYear() === date.getFullYear()
            && pomodoro.status === PomodoroStatus.FINISHED;
        });

        console.log(pomodoros.length,"lenght");
        
        
        const task_ids : {[key: string]: {n: number,di: number,de: number, minutes: number}} = {};

        pomodoros.forEach((pomodoro) => {
            const {task_id,internal_distraction,external_distraction,minutes} = pomodoro;
           if(!task_ids[task_id.toString()]){
            task_ids[task_id.toString()] = { n : 1, di: internal_distraction, de: external_distraction, minutes};
           }else{
            task_ids[task_id.toString()] = {
                 n : task_ids[task_id.toString()].n + 1, 
                 di: pomodoro.internal_distraction + task_ids[task_id.toString()].di, 
                 de: pomodoro.external_distraction  + task_ids[task_id.toString()].de,
                 minutes: pomodoro.minutes + task_ids[task_id.toString()].minutes};
           }
        });
        
        const tasks = [];
        const task_without_name = {name:"Tareas Sin Nombre",estimated_effort: 0,real_effort: 0,status: PomodoroStatus.FINISHED,di:0,de:0,minutes:0};
        for ( const [key, value] of Object.entries(task_ids)) {
            const {n,di,de,minutes} = value;

            if(!user.tasks[key]){
                task_without_name.real_effort ++;
                task_without_name.di = di + task_without_name.di;
                task_without_name.de = de + task_without_name.de;
                task_without_name.minutes = minutes + task_without_name.minutes;
            }else{
            const {name,estimated_effort,status,project_id} = user.tasks[key];
            tasks.push({name,estimated_effort,real_effort: n,status,di,de,minutes});
            }
        }
        if(task_without_name.real_effort > 0){
            tasks.push(task_without_name);
        }        
            
        return {message: "Pomodoros retrieved successfully", type: "success", data: pomodoros};
    }



    return { addPomodoro, changePomodoroStatus,scoreDistraccion,getDailyPomodoros };
};

export {createPomodoroController};
