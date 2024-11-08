import { useGlobalContext } from "@/context/AppContext";
import { ListTypes } from "../models/List";
import { User } from "../models/User";
import Realm from "realm";


/**
 * Retorna el id de la lista principal del usuario.
 * @returns {Realm.BSON.ObjectId | undefined} El id de la lista principal o null si no se encuentra.
 */
export const getMainListID = (user: User | null,realm: Realm) => {
    if(realm && user && user.lists){
        const list_id = user.lists.find(list => list.type === ListTypes.MAIN)?._id;
        return list_id
    }else{
        console.log("Error al obtener la lista principal");
        return undefined
    }
}