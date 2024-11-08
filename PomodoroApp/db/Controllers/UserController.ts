import Realm from "realm"
import { User } from "../models/User";
import { List, ListTypes } from "../models/List";
import { Project } from "../models/Project";


const createUserController = (realm : Realm|null) => {
    const addUser = ( username : string, password: string) => {
    if(!realm){
        console.log("Error al crear el usuario, Realm not found");
        return;
    }
        realm.write(() => {
            const user_id = new Realm.BSON.ObjectId();
            const mainList = List.generate("Today", ListTypes.MAIN) as List;
            const activities = List.generate("Activity Inventory", ListTypes.OTHER) as List;
            const record = List.generate("Record", ListTypes.RECORD) as List;
            const defaultProject = Project.generate("No Project") as Project;
            const newUser = realm.create('User', User.generate(user_id,username,password,[mainList,activities,record],defaultProject));
            return newUser 
        })
    }

    return {addUser}
}



export {createUserController}