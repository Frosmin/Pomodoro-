import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, Button } from "react-native";

import util_styles from "@/styles/utils";
import taskList_styles from "@/styles/taskList";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";

interface NewTask {
  name: string;
  estimated_effort: number;
}
const tareas = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    name: "",
    estimated_effort: 1,
  });
  const [render, setRender] = useState<boolean>(false);
  const {
    user,
    controllers: {
      TaskController: { getTasksByList, deleteTask, addTask },
      ListController: { getMainListID },
    },
  } = useGlobalContext();

  const handleAddTask = () => {
    if (newTask.name.trim() !== "") {
      console.log("Añadiendo Tarea");
      addTask({
        name: newTask.name,
        estimated_effort: 1,
        list_id: getMainListID(),
      });
      setNewTask({ name: "", estimated_effort: 1 });
      setRender(!render);
    }
  };
  const handleDeleteTask = (taskId: Realm.BSON.ObjectID) => {
    console.log(taskId.toString(), "Eliminando Tarea");
    setRender(!render);
    deleteTask(taskId);
  };

  const getTasks = useCallback(() => {}, [user?.tasks, tasks]);

  useEffect(() => {
    if ((user?.tasks, tasks)) {
      // Only update tasks if there's a change in user.tasks
      setTasks(getTasksByList(getMainListID()));
    }
  }, [render]); // Watch for changes in user.tasks

  return (
    <View style={taskList_styles.container}>
      <Text style={util_styles.title}>Tareas</Text>
      <View>
        <TextInput
          placeholder="Nueva Tarea"
          value={newTask.name}
          onChangeText={(text) => setNewTask({ ...newTask, name: text })}
        />
        <Button title="Añadir" onPress={handleAddTask}></Button>
      </View>
      <View>
        {tasks.length > 0 &&
          tasks.map((task) => (
            <View key={task._id.toString()}>
              <Text>{task.name}</Text>
              <Text>{task.real_effort}</Text>
              <Text>{task.estimated_effort}</Text>
              <Button
                title="Eliminar"
                onPress={handleDeleteTask.bind(this, task._id)}
              ></Button>
            </View>
          ))}
      </View>
    </View>
  );
};

export default tareas;
