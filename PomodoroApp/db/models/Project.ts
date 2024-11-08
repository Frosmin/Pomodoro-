import Realm from "realm";
import { ObjectSchema } from "realm";

class Project extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    name!: string;
    static generate (name: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name,
        };
    }
  
    static schema: ObjectSchema = {
        name: 'Project',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
        },
      }
   }
   

export {Project}