import { User } from "../models/User";
import Realm from "realm";
import { Task, TaskStatus } from "../models/Task";
import { createProjectController } from "./ProjectController";
import { useObject } from "@realm/react";
import { NewTask } from "../models/Task";
import { createListController } from "./ListController";
import { List, ListTypes } from "../models/List";

const createTaskController = (user: User | null, realm: Realm | null) => {
  const addTask = (body: {
    name: string;
    estimated_effort: number;
    list_id: Realm.BSON.ObjectID ;
    project_id: Realm.BSON.ObjectID;
  }) => {
    if (!realm || !user) {
      return { status: "error", message: "Missing user or realm" };
    }

    let { name, estimated_effort, list_id, project_id } = body;
    if (!list_id) {
      return { status: "error", message: "List not found" };
    }

    const { getDefaultProjectId } = createProjectController(user, realm);
    const {getListIdByType} = createListController(user, realm);
    const p_id : Realm.BSON.ObjectID = project_id ? project_id : getDefaultProjectId();
    const l_id : Realm.BSON.ObjectID = list_id ? list_id : getListIdByType(ListTypes.MAIN);
    realm.write(() => {
      const taskId = new Realm.BSON.ObjectId();
      user.tasks[taskId.toString()] = Task.generate(
        taskId,
        name,
        estimated_effort,
        p_id,
        l_id
      ) as Task;
    });

    return { status: "success", message: "Task added successfully" };
  };

  const getTasksByList = (list_id: Realm.BSON.ObjectID | undefined) => {
    if (!user || !list_id) {
      console.log("Error retrieving tasks");
      return [];
    }

    return Object.values(user.tasks).filter(
      (task) => task.list_id.toString() === list_id.toString()
    );
  };

  const getTaskByListType = (list_type: ListTypes) => {
    if (!user) {
      console.log("Error retrieving tasks");
      return [];
    }

    const list_id : Realm.BSON.ObjectID  | undefined= user.lists.find((list) => list.type === list_type)?._id;
    console.log("list_id",list_id);
    const list_id_string = list_id ? list_id.toString() : "1";
    if( !list_id) {
      console.log("The list type doesn't exist");
      return [];
    }
    return Object.values(user.tasks).filter(
      (task) => task.list_id.toString() === list_id.toString()   
    );
  }

  const getTasksByProject = (project_id: Realm.BSON.ObjectID) => {
    if (!user) {
      console.log("Error retrieving tasks");
      return [];
    }

    return Object.values(user.tasks).filter(
      (task) => task.project_id.toString() === project_id.toString()
    );
  };

  const editTask = (id: string ,newTask: NewTask) => {
    if (!realm || !user) {
      return { status: "error", message: "Missing user or realm",task:  newTask};
    }

    realm.write(() => {
      const task = user.tasks[id];
      if (task) {
        task.name = newTask.name;
        task.estimated_effort = newTask.estimated_effort;
      }
      return { status: "success", message: "Task edited successfully",task};
    });
  }

  const updateTask = (
    taskId: Realm.BSON.ObjectID,
    updatedTask: { name: string; estimated_effort: number; started_at: Date }) => {
    if (!realm || !user) {
      console.log("Error updating task");
      return;
    }
    realm.write(() => {
      const task = user.tasks[taskId.toString()];
      if (task) {
        task.name = updatedTask.name;
        task.estimated_effort = updatedTask.estimated_effort;
        task.started_at = new Date();
      }
    });
  };

  const incrementEffort = (taskId: string) => {
    if (!realm || !user || !taskId) {
      console.log("Error updating task");
      return;
    }

    const taskId_realm = new Realm.BSON.ObjectId(taskId);
    realm.write(() => {
      const task = user.tasks[taskId_realm.toString()];
      if (task) {
        task.real_effort += 1;
      }
    });
  };

  const changeTaskStatus = (taskId: string) => {
    if (!realm || !user) {
      console.log("Error updating task");
      return;
    }
    const taskId_realm = new Realm.BSON.ObjectId(taskId);
    realm.write(() => {
      const task = user.tasks[taskId_realm.toString()];
      if (task.status) {
        task.status =
          task.status === TaskStatus.NOT_STARTED
            ? TaskStatus.FINISHED
            : TaskStatus.NOT_STARTED;
      }
    });
  };

  const removeCompletedTasks = () => {
    if (!realm || !user) {
      console.log("Error removing completed tasks");
      return;
    }

    const {getListIdByType} = createListController(user, realm);

    const mainListId = getListIdByType(ListTypes.MAIN);
    const recordListId = getListIdByType(ListTypes.RECORD);

      const completedTasks = Object.values(user.tasks).filter(
        (task) => task.status === TaskStatus.FINISHED && task.list_id.toString() === mainListId.toString()
      );

      if(recordListId !== undefined) { 
        realm.write(() => {
        completedTasks.forEach((task) => {
           user.tasks[task._id.toString()].list_id = recordListId;
          });
        })
      }
  };

  const removeAllTasks = () => {
    if (!realm || !user) {
      console.log("Error removing all tasks");
      return;
    }

    const {getListIdByType} = createListController(user, realm);

    const mainListId = getListIdByType(ListTypes.MAIN);
    const recordListId = getListIdByType(ListTypes.RECORD);

    const mainListTasks = Object.values(user.tasks).filter(
      (task) =>  task.list_id.toString() === mainListId.toString()
    );
    realm.write(() => {
      if(recordListId !== undefined) { 
        mainListTasks.forEach((task) => {
          if(task.status === TaskStatus.FINISHED){
            user.tasks[task._id.toString()].list_id = recordListId;
          }else{
            if(task.real_effort > 0){
              user.tasks[task._id.toString()].list_id = recordListId;
            }else{
              delete user.tasks[task._id.toString()];
            }
          }
        });
      }
    });

  }

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
      const task = user.tasks[task_id.toString()];
      if(task.real_effort > 0){ 
        const recordListId = user.lists.find((list) => list.type === ListTypes.RECORD)?._id;
        user.tasks[task_id.toString()].list_id = recordListId!;
      }else{
        delete user.tasks[task_id.toString()];
      }
    });
  };

  const changeListType = (task_ids : Realm.BSON.ObjectID[], list_type : ListTypes) => {
    if (!realm || !user) {
      console.log("Error retrieving tasks");
      return [];
    }
    const list_id : Realm.BSON.ObjectID  | undefined= user.lists.find((list) => list.type === list_type)?._id;
    if( !list_id) {
      console.error("The list type doesn't exist");
      return [];
    }
    realm.write(() => {
      task_ids.forEach((task_id) => {
        const task = user.tasks[task_id.toString()];
        if (task) {
          task.list_id = list_id!;
        }
      });
    });
  };

  const getTaskForReports = () => {
    if (!realm || !user) {
      console.log("Error retrieving tasks");
      return [];
    }
    const mainListId = user.lists.find((list) => list.type === ListTypes.MAIN)?._id;
    const recordListId = user.lists.find((list) => list.type === ListTypes.RECORD)?._id;

    const tasks =Object.values(user.tasks).filter((task) =>task.list_id.toString() === mainListId?.toString() || task.list_id.toString() === recordListId?.toString());

    return tasks; 
  };
  return {
    addTask,
    getTasksByList,
    deleteTask,
    updateTask,
    editTask,
    incrementEffort,
    getTasksByProject,
    changeTaskStatus,
    getTaskByListType,
    changeListType,
    removeCompletedTasks,
    removeAllTasks,
    getTaskForReports
  };
};

export { createTaskController };
