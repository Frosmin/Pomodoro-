import Realm from "realm";
import { ObjectSchema } from "realm";


enum ListTypes  {
    MAIN = "main",
    OTHER= "other"
}

class Task extends Realm.Object {
    _id!: number;
    name!: string;
    estimated_effort!: number;
    real_effort!: number;
    project_id!: Realm.BSON.ObjectId;
    started_at!: Date;
    status!: string; // Assuming CHAR translates to a single character string

    static generate(name: string, estimated_effort: number, real_effort: number, project_id: number) {
        return {
            _id: new Realm.BSON.ObjectId(), // Example task_id generation
            name,
            estimated_effort,
            real_effort,
            project_id,
        };
    }

    static schema: ObjectSchema = {
        name: 'Task',
        primaryKey: '_id',
        properties: {
            id: 'int',
            name: 'string',
            estimated_effort: {type: 'int', default:1},
            real_effort: {type: 'int', default:0},
            project_id: {type: 'objectId', optional: true},
            started_at: 'date',
            status: 'string',
        },
    };
}

export { Task };

