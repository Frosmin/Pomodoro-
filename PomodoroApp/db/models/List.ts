import Realm from "realm";
import { ObjectSchema } from "realm";
import { Task } from "./Task";


export enum ListTypes  {
    MAIN = "main",
    OTHER= "other",
    RECORD= "record"
}

class List extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    name!: string;
    type!: ListTypes;
    static generate(name: string, type: ListTypes) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name,
            type,
        };
    }
  
    static schema: ObjectSchema = {
        name: 'List',
        primaryKey: '_id',
        properties: {
          _id: 'objectId',
          name: 'string',
          type: 'string',
        },
      }

    //   Metodo para validar el tipo de lista
      static validateListType(list_type: string) {
        return list_type === ListTypes.MAIN || list_type === ListTypes.OTHER;
      }
  }

export {List}