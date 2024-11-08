import { User } from "../models/User";
import Realm from "realm";
import { Task } from "../models/Task";
import { createProjectController} from "./ProjectController";

const createTaskController = (user: User | null, realm: Realm | null) => {
    const addTask = (body: {
        name: string;
        estimated_effort: number;
        list_id: Realm.BSON.ObjectID | undefined;
        project_id?: Realm.BSON.ObjectID;
    }) => {
        if (!realm || !user) {
            return { status: "error", message: "Missing user or realm" };
        }

        let { name, estimated_effort, list_id, project_id } = body;
        if (!list_id) {
            return { status: "error", message: "List not found" };
        }
        const { getDefaultProjectId } = createProjectController(user, realm);

        project_id = project_id || getDefaultProjectId();

        realm.write(() => {
            const taskId = new Realm.BSON.ObjectId();
            user.tasks[taskId.toString()] = Task.generate(
                taskId,
                name,
                estimated_effort,
                project_id,
                list_id
            ) as Task;
        });

        return { status: "success", message: "Task added successfully" };
    };

    const getTasksByList = (list_id: Realm.BSON.ObjectID | undefined) => {
        if ( !user || !list_id) {
            console.log("Error retrieving tasks");
            return [];
        }

        return Object.values(user.tasks).filter(
            (task) => task.list_id.toString() === list_id.toString()
        );
    };


/**
 * Elimina una tarea del diccionario de tareas del usuario.
 * 
 * @param {Realm.BSON.ObjectID | undefined} task_id - El ID de la tarea a eliminar.
 * @returns {void} No devuelve ningún valor, pero registra un error si falta el realm, el usuario o el task_id.
 */
    const deleteTask = (task_id: Realm.BSON.ObjectID | undefined) => {
        if (!realm || !user || !task_id) {
            console.log("Error retrieving tasks");
            return [];
        }
        realm.write(() => {
            delete user.tasks[task_id.toString()];
        })
    }
    return {
        addTask,
        getTasksByList,
        deleteTask
    };
};

export { createTaskController };
