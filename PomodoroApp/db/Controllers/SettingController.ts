import Realm from "realm";
import { User } from "../models/User";
import Setting from "../models/Setting";



const createSettingController = (user: User | null, realm: Realm | null) => {
    
/**
 * Retorna el id de la lista principal del usuario.
 * @returns {Realm.BSON.ObjectId | undefined} El id de la lista principal o null si no se encuentra.
 */
        const updateSettings = (settings : Setting) => {
            if(realm && user && user.settings){
                realm.write(() => {
                    user.settings = settings;
                });
            }
        }

    return {updateSettings}
}

export { createSettingController};