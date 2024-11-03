import Realm from "realm";
import { ObjectSchema } from "realm";
import { List } from "./List";

enum UserStatus  {
    ACTIVE = "active",
    INACTIVE= "inactive"
}

class User extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    username!: string;
    password!: string;
    status!: UserStatus; // active or inactive
    list!: List[];
    plan?: Realm.BSON.ObjectID;
    createdAt!: Date;
    static generate(username: string, password: string) {
        return {
            _id: new Realm.BSON.ObjectId(),
            username,
            password,
            createdAt: new Date(),
        };
    }
  
    static schema: ObjectSchema = {
        name: 'User',
        primaryKey: '_id',
        properties: {
          _id: 'objectId',
          username: 'string',
          password: 'string',
          status: { type: 'string',default: UserStatus.ACTIVE },
          list: { type: 'list',objectType:'List' ,default: [] },
          plan: { type: "objectId", optional: true},
          createdAt: 'date',
        },
        
      }

    //   Metodo para validar el estado
      static validateStatus(status: string) {
        return status === UserStatus.ACTIVE || status === UserStatus.INACTIVE;
      }
      // Then, use `TaskSchema` wherever you're defining the Task object.
  }

export {User}