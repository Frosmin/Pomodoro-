import Realm from "realm";
import { ObjectSchema } from "realm";

enum TaskStatus{
    NOT_STARTED = "NOT_STARTED",
    FINISHED = "FINISHED"
}

class Task extends Realm.Object {
    _id!: Realm.BSON.ObjectID;
    name!: string;
    estimated_effort!: number;
    real_effort!: number;
    project_id!: Realm.BSON.ObjectId;
    started_at?: Date;
    status!: TaskStatus; // Assuming CHAR translates to a single character string

    static generate(name: string, estimated_effort: number, real_effort: number, project_id: number) {
        return {
            _id: new Realm.BSON.ObjectId(),
            name,
            estimated_effort,
            real_effort,
            project_id,
            status: TaskStatus.NOT_STARTED
        };
    }

    static schema: ObjectSchema = {
        name: 'Task',
        primaryKey: '_id',
        properties: {
            _id: 'objectId',
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

