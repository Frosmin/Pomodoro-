import { useGlobalContext } from "@/context/AppContext";
import Realm from "realm";
import {User} from "../models/User";



const createProjectController = (user: User | null, realm: Realm | null) => {
    /**
     * Recupera el ID del proyecto predeterminado llamado "No Project" para el usuario actual.
     * 
     * @returns {Realm.BSON.ObjectId} El ID del proyecto predeterminado si se encuentra, de lo contrario undefined.
     */
    const getDefaultProjectId = () => {

        if(realm && user){
            const project_id = user.projects.find(project => project.name === "No Project")?._id;
            return project_id ? project_id : new Realm.BSON.ObjectId(0) ;
        }else{
            return new Realm.BSON.ObjectId(0);
        }
    }
    return {getDefaultProjectId}
}






export {createProjectController}

