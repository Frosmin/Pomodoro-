import Realm from "realm";


enum PomodoroStatus {
    NOT_STARTED = "NOT_STARTED",
    IN_PROGRESS = "IN_PROGRESS",
    PAUSED = "PAUSED",
    FINISHED = "FINISHED",
    CANCELED = "CANCELED",
}

export class Pomodoro extends Realm.Object {
  _id!: Realm.BSON.ObjectId;
  user_id!: Realm.BSON.ObjectID;
  task_id!: Realm.BSON.ObjectID;
  status!: PomodoroStatus;
  started_at?: Date;
  ended_at?: Date;
  internal_distraction!: number;
  external_distraction!: number;

  static generate(user_id: Realm.BSON.ObjectID, task_id?: Realm.BSON.ObjectID) {
    task_id = task_id ? task_id : new Realm.BSON.ObjectID(0);
    return {
      _id: new Realm.BSON.ObjectId(),
      user_id,
      task_id,
      status: PomodoroStatus.NOT_STARTED,
      internal_distraction: 0,
      external_distraction: 0,
    };
  }

  static schema = {
    name: 'Pomodoro',
    primaryKey: '_id',
    properties: {
      _id: { type: 'objectId', default: new Realm.BSON.ObjectId() },
      user_id: { type: 'objectId' },
      task_id: { type: 'objectId', default: new Realm.BSON.ObjectID(0) },
      status: { type: 'string', default: PomodoroStatus.NOT_STARTED },
      started_at: { type: 'date' },
      ended_at: { type: 'date' },
      internal_distraction: { type: 'int', default: 0 },
      external_distraction: { type: 'int', default: 0 },
    },
  };

  static validateStatusType(status_type: string) {
    return Object.values(PomodoroStatus).includes(status_type as PomodoroStatus);
  }

}
