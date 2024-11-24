import Realm from "realm";
import {User} from "../models/User";
import { Pomodoro ,PomodoroStatus} from "../models/Pomodoro";
import { PomodoroState } from "@/context/reducer";


export enum DisctractionType {
    INTERNAL = "INTERNAL",
    EXTERNAL = "EXTERNAL",
}

const createPomodoroController = (user: User | null, realm: Realm | null) => {
    const addPomodoro = (task_id: string) => {
        

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
                const newPomodoro = realm.create<Pomodoro>('Pomodoro', Pomodoro.generate(pomodoro_id,realm_task_id));
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



    return { addPomodoro, changePomodoroStatus,scoreDistraccion };
};

export {createPomodoroController};
