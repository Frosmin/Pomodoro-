import Realm from "realm";
import { ObjectSchema } from "realm";
import { List } from "./List";
import { Project } from "./Project";
import { Task } from "./Task";
import { Pomodoro } from "./Pomodoro";

enum UserStatus  {
    ACTIVE = "active",
    INACTIVE= "inactive"
}

class User extends Realm.Object {
    _id!: Realm.BSON.ObjectId;
    username!: string;
    password!: string;
    status!: UserStatus; // active or inactive
    lists!: Realm.List<List>;
    plan?: Realm.BSON.ObjectID;
    projects!: Realm.List<Project>;
    tasks!: Realm.Dictionary<Task>;
    pomodoros!: Realm.Dictionary<Pomodoro>;
    createdAt!: Date;
    static generate(user_id: Realm.BSON.ObjectID,username: string, password: string,lists: List[],project: Project) {
        return {
            _id: user_id,
            username,
            password,
            status: UserStatus.ACTIVE,
            lists : lists,
            projects: [project],
            tasks : {},
            plan: undefined,
            pomodoros: {},
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
          status: 'string',
          lists: { type: 'list',objectType:'List' },
          projects: {type: 'list', objectType:'Project'},
          tasks: {type : 'dictionary', objectType: 'Task'},
          pomodoros: {type: 'dictionary', objectType: 'Pomodoro'},
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