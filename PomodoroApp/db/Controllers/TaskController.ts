import Realm, { BSON } from "realm"
import { User } from "../models/User";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "../models/Task";
import { useObject } from "@realm/react";


const {user,realm} = useGlobalContext();

/**
 * Adds a task to the user's tasks list, and the task's project list.
 * If no project is given, the task will be added to the user's first project.
 * If no user is given, the task will be added to the user's tasks list.
 * @param {string} name The name of the task
 * @param {number} estimated_effort The estimated effort of the task, defaults to 1
 * @param {Realm.BSON.ObjectID} list_id The id of the list where the task will be added
 * @param {Realm.BSON.ObjectID} project_id The id of the project where the task will be added
 * @returns {{status: string,message: string}} An object with status and message properties, indicating whether the task was successfully added or not.
 */
export const addTask = (
    name: string,
    estimated_effort: number = 1,
    list_id: Realm.BSON.ObjectID,
    project_id?: Realm.BSON.ObjectID,
) => {
    
    if(!project_id && user && user.projects[0]){
        project_id = user.projects[0]._id
    } else{
        return {status : "error", message: "Project not found"}
    }
    if(realm && user){
        let taskId = new Realm.BSON.ObjectId();
        while(user.tasks[taskId.toString()]){
            taskId = new Realm.BSON.ObjectId();
        }
        realm.write(() => {
            user.tasks[taskId.toString()] = (Task.generate(taskId,name,estimated_effort,project_id,list_id) as Task)
        })
        return {status : "success",message: "Tarea agregada correctamente"}
    }
    return {status : "error", message: "No se pudo agregar la tarea"}
}