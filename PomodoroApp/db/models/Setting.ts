import Realm from "realm";
import { ObjectSchema } from "realm";

class Timer extends Realm.Object {
    focus!: number;
    shortBreak!: number;
    longBreak!: number;
    intervals!: number;

    static schema: ObjectSchema = {
        name: "Timer",
        properties: {
            focus: "int",
            shortBreak: "int",
            longBreak: "int",
            intervals: "int"
        }
    };
}

class Sounds extends Realm.Object {
    alarm!: boolean;
    alarmVolume!: number;
    tick!: boolean;
    tickVolume!: number;

    static schema: ObjectSchema = {
        name: "Sounds",
        properties: {
            alarm: "bool",
            alarmVolume: "float",
            tick: "bool",
            tickVolume: "float"
        }
    };
}

class Theme extends Realm.Object {
    focus!: number;
    shortBreak!: number;
    longBreak!: number;

    static schema: ObjectSchema = {
        name: "Theme",
        properties: {
            focus: "int",
            shortBreak: "int",
            longBreak: "int"
        }
    };
}

class AdvancedPomodoro extends Realm.Object {
    active!: boolean;
    firstReminder!: number;
    lastReminder!: number;
    remindersVolume!: number;

    static schema: ObjectSchema = {
        name: "AdvancedPomodoro",
        properties: {
            active: "bool",
            firstReminder: "int",
            lastReminder: "int",
            remindersVolume: "float"
        }
    };
}


class Setting extends Realm.Object {
    _id! : Realm.BSON.ObjectId;
    focus!: number;
    shortBreak!: number;
    longBreak!: number;
    intervals!: number;
    alarm!: boolean;
    alarmVolume!: number;
    tick!: boolean;
    tickVolume!: number;
    focusTheme!: number;
    shortBreakTheme!: number;
    longBreakTheme!: number;
    advancedPomodoro!: boolean;
    firstReminder!: number;
    lastReminder!: number;
    remindersVolume!: number;
    static generate() {
        return {
            _id: new Realm.BSON.ObjectId(),
            focus: 25 * 60,
            shortBreak: 5 * 60,
            longBreak: 15 * 60,
            intervals: 4,
            alarm: true,
            alarmVolume: 50,
            tick: true,
            tickVolume: 50,
            focusTheme: 0,
            shortBreakTheme: 1,
            longBreakTheme: 2,
            advancedPomodoro: false,
            firstReminder: 5,
            lastReminder: 5,
            remindersVolume: 50
        }
    };

    static schema: ObjectSchema = {
        name: 'Setting',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            focus: "int",
            shortBreak: "int",
            longBreak: "int",
            intervals: "int",
            alarm: "bool",
            alarmVolume: "float",
            tick: "bool",
            tickVolume: "float",
            focusTheme: "int",
            shortBreakTheme: "int",
            longBreakTheme: "int",
            advancedPomodoro: "bool",
            firstReminder: "int",
            lastReminder: "int",
            remindersVolume: "float"   
        }
    } 
}

export default Setting