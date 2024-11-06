import Realm from "realm";
import { ObjectSchema } from "realm";

class Project extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    name!: string;
    user_id!: Realm.BSON.ObjectID; 
    tasks!: Realm.List<Realm.BSON.ObjectID>
    static generate(name: string, user_id: Realm.BSON.ObjectID) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name,
            user_id,
            tasks: new Realm.List<Realm.BSON.ObjectID>(),
        };
    }
  
    static schema: ObjectSchema = {
        name: 'Project',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
            name: 'string',
          user_id: 'objectId',
          tasks: { type: 'list', objectType: 'objectId' },
        },
      }
   }

export {Project}