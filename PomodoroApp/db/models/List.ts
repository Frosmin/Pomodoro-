import Realm from "realm";
import { ObjectSchema } from "realm";


enum ListTypes  {
    MAIN = "main",
    OTHER= "other"
}

class List extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    name!: string;
    type!: ListTypes;
    status!: string; // active or inactive
    tasks!: Realm.List<Realm.BSON.ObjectID>;
    static generate(name: string, type: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name,
            type,
            createdAt: new Date(),
        };
    }
  
    static schema: ObjectSchema = {
        name: 'List',
        primaryKey: '_id',
        properties: {
          _id: 'objectId',
          name: 'string',
          type: { type: 'string', },
          status: { type: 'string' },
          tasks: { type: 'list', objectType: 'objectId' },
        },
      }

    //   Metodo para validar el tipo de lista
      static validateListType(list_type: string) {
        return list_type === ListTypes.MAIN || list_type === ListTypes.OTHER;
      }
      // Then, use `TaskSchema` wherever you're defining the Task object.
  }

export {List}