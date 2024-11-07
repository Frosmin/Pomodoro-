import Realm from "realm"
import { User } from "../models/User";
import { List, ListTypes } from "../models/List";
import { Project } from "../models/Project";

const addUser = (realm : Realm, body: { username : string, password: string}) => {
    
    realm.write(() => {
        const user_id = new Realm.BSON.ObjectId();
        const mainList = List.generate("Today", ListTypes.MAIN) as List;
        const activities = List.generate("Activity Inventory", ListTypes.OTHER) as List;
        const record = List.generate("Record", ListTypes.RECORD) as List;
        const defaultProject = Project.generate("No Project") as Project;
        const newUser = realm.create('User', User.generate(user_id,body.username,body.password,[mainList,activities,record],defaultProject));
        return newUser
    })
}


export {addUser}