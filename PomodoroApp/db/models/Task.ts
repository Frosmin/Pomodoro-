import Realm from "realm";
import { ObjectSchema } from "realm";

export enum TaskStatus{
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    FINISHED = "FINISHED"
}

class Task extends Realm.Object {
    _id!: Realm.BSON.ObjectID;
    name!: string;
    estimated_effort!: number;
    real_effort!: number;
    project_id!: Realm.BSON.ObjectID;
    list_id!: Realm.BSON.ObjectID;
    started_at?: Date;
    status!: TaskStatus; // Assuming CHAR translates to a single character string

    static generate(taskId: Realm.BSON.ObjectID,name: string, estimated_effort: number, project_id: Realm.BSON.ObjectID,list_id: Realm.BSON.ObjectID) {
        return {
            _id: taskId,
            name,
            estimated_effort,
            real_effort : 0,
            project_id,
            list_id,
            started_at: new Date(),
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
            list_id: 'objectId',
            started_at: 'date',
            status: 'string',
        },
    };
}

export { Task };

