import { useGlobalContext } from "@/context/AppContext";

const {realm,user} = useGlobalContext();


/**
 * Recupera el ID del proyecto predeterminado llamado "No Project" para el usuario actual.
 * 
 * @returns {Realm.BSON.ObjectId | undefined} El ID del proyecto predeterminado si se encuentra, de lo contrario undefined.
 */
export const getDefaultProjectId = () => {

    if(realm && user){
        const project_id = user.projects.find(project => project.name === "No Project")?._id;
        return project_id
    }else{
        return undefined;
    }
}


