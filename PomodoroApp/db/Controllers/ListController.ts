import { useGlobalContext } from "@/context/AppContext";
import { ListTypes } from "../models/List";

const {user,realm} = useGlobalContext();


export const getMainListID = () => {
    if(realm && user && user.lists){
        const list_id = user.lists.find(list => list.type === ListTypes.MAIN)?._id;
        return list_id
    }else{
        console.log("Error al obtener la lista principal");
        return null
    }
}