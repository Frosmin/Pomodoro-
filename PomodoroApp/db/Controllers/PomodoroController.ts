import Realm from "realm";
import {User} from "../models/User";
import { Pomodoro } from "../models/Pomodoro";
import { PomodoroState } from "@/context/reducer";


export const createPomodoroController = (user: User | null, realm: Realm | null) => {
    const addPomodoro = (task_id: Realm.BSON.ObjectID) => {
        if (!realm || !user) {
            return { status: "error", message: "Missing user or realm" };
        }

        try {
            realm.write(() => {
                let pomodoro_id = new Realm.BSON.ObjectId();
                while (user.pomodoros[pomodoro_id.toString()]) {
                    pomodoro_id = new Realm.BSON.ObjectId();
                }
                const newPomodoro = realm.create<Pomodoro>('Pomodoro', Pomodoro.generate(pomodoro_id,task_id));
                user.pomodoros[newPomodoro._id.toString()] = newPomodoro;
            });
            return { status: "success", message: "Pomodoro added successfully" };
        } catch (error) {
            console.error("Error adding pomodoro:", error);
            return { status: "error", message: "Failed to add pomodoro" };
        }
    };

    const changePomodoroStatus = (pomodoro_id: string, status: PomodoroState) => {}

    return { addPomodoro };
};
