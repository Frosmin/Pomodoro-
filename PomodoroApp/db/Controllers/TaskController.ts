import Realm, { BSON } from "realm"
import { User } from "../models/User";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "../models/Task";
import { useObject } from "@realm/react";


const {user,realm} = useGlobalContext();

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
        //        
        realm.write(() => {
            user.tasks.push(Task.generate(name,estimated_effort,project_id,list_id) as Task)
        })
        return {status : "success",message: "Tarea agregada correctamente"}
    }

    
}