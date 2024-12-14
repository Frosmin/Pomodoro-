import Realm from "realm"
import { User } from "../models/User";
import { List, ListTypes } from "../models/List";
import { Project } from "../models/Project";
import Setting from "../models/Setting";


const createUserController = (realm : Realm|null) => {
    const addUser = ( username : string, password: string) => {
    if(!realm){
        console.log("Error al crear el usuario, Realm not found");
        return;
    }
        realm.write(() => {
            const user_id = new Realm.BSON.ObjectId();
            const mainList = List.generate("Hoy", ListTypes.MAIN) as List;
            const activities = List.generate("Inventario de Actividades", ListTypes.OTHER) as List;
            const record = List.generate("Record", ListTypes.RECORD) as List;
            const defaultProject = Project.generate("Sin Proyecto") as Project;
            const settings = Setting.generate() as Setting;
            const newUser = realm.create('User', User.generate(user_id,username,password,[mainList,activities,record],defaultProject,settings));
            return newUser 
        })
    }

    return {addUser}
}



export {createUserController}