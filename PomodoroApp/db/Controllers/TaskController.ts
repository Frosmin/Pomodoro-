import Realm, { BSON } from "realm"
import { User } from "../models/User";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "../models/Task";
import { useObject } from "@realm/react";


const {user,realm} = useGlobalContext();

/**
 * Agrega una tarea a la lista de tareas del usuario y a la lista de tareas del proyecto.
 * Si no se proporciona un proyecto, la tarea se agregar  al primer proyecto del usuario.
 * Si no se proporciona un usuario, la tarea se agregar  a la lista de tareas del usuario.
 * @param {string} name El nombre de la tarea
 * @param {number} estimated_effort El esfuerzo estimado de la tarea, por defecto es 1
 * @param {Realm.BSON.ObjectID} list_id El id de la lista donde se agregar  la tarea
 * @param {Realm.BSON.ObjectID} project_id El id del proyecto donde se agregar  la tarea
 * @returns {{status: string,message: string}} Un objeto con propiedades de estatus y mensaje, indicando si la tarea se agreg  con  xito o no.
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


export const getTasksByList = (list_id: Realm.BSON.ObjectID) => {

    if(realm && user){
        let tasks : Task[]= [];

        for (const taskId in user.tasks) {
            const task = user.tasks[taskId];
            if(task.list_id.toString() === list_id.toString()){
                tasks.push(task)
            }
        }
        return tasks
    }else{
        console.log("Error al obtener las tareas");
        return []
    }
}