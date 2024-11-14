import Realm from "realm";
import {User} from "../models/User";
import { Pomodoro } from "../models/Pomodoro";


export const createPomodoroController = (user: User | null, realm: Realm | null) => {
    const addPomodoro = () => {
        if (!realm || !user) {
            return { status: "error", message: "Missing user or realm" };
        }

        try {
            realm.write(() => {
                const newPomodoro = realm.create<Pomodoro>('Pomodoro', Pomodoro.generate());
                user.pomodoros.push(newPomodoro);
            });
            return { status: "success", message: "Pomodoro added successfully" };
        } catch (error) {
            console.error("Error adding pomodoro:", error);
            return { status: "error", message: "Failed to add pomodoro" };
        }
    };

    return { addPomodoro };
};
