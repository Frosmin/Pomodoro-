import { ListTypes } from "../models/List";
import { User } from "../models/User";
import Realm from "realm";


const createListController = (user: User | null, realm: Realm | null) => {
    
/**
 * Retorna el id de la lista principal del usuario.
 * @returns {Realm.BSON.ObjectId | undefined} El id de la lista principal o null si no se encuentra.
 */
        const getMainListID = () => {
        if(realm && user && user.lists){
            const list_id = user.lists.find(list => list.type === ListTypes.MAIN)?._id;
            return list_id ? list_id : new Realm.BSON.ObjectId(1);
        }else{
            console.log("Error al obtener la lista principal");
            return new Realm.BSON.ObjectId(1);
        }
        }

        const getActiveLists = () => {
            if(realm && user && user.lists){
                return Array.from(user.lists.filter(list => list.type === ListTypes.MAIN || list.type === ListTypes.OTHER))
            }
            return [];
        }

    return {getMainListID,getActiveLists}
}

export { createListController};
