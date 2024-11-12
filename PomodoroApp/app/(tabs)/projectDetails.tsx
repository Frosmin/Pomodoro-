import React, { useCallback, useEffect, useState } from "react";
import { View, Text, TextInput, Button, StyleSheet, TouchableOpacity, FlatList } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import util_styles from "@/styles/utils";
import taskList_styles from "@/styles/taskList";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";

interface NewTask {
  name: string;
  estimated_effort: number;
}

export default function ProjectDetails() {
  const { projectName } = useLocalSearchParams<{ projectName: string }>();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({ name: "", estimated_effort: 1 });
  const [render, setRender] = useState<boolean>(false);
  const { user, controllers: { TaskController: { getTasksByList, deleteTask, addTask,getTasksByProject}, ListController: { getMainListID } } } = useGlobalContext();

  const handleAddTask = () => {
    if (newTask.name.trim() !== "") {
      console.log("Añadiendo Tarea");
      if (user) {
        const project_id = user.projects.find(project => project.name === projectName)?._id;
        addTask({
          name: newTask.name,
          estimated_effort: 1,
          list_id: getMainListID(),
          project_id: project_id,
        });
        setNewTask({ name: "", estimated_effort: 1 });
        setRender(!render);
      } else {
        console.error("User is null");
      }
    }
  };

  useEffect(() => {
    if (user) {
      const project = user.projects.find(project => project.name === projectName);
      if (project) {
        const project_id = project._id;
        setTasks(getTasksByProject(project_id));
      } else {
        console.error("Project not found");
      }
    }
  }, [render, user, projectName]);


  const handleDeleteTask = (taskId: Realm.BSON.ObjectID) => {
    console.log(taskId.toString(), "Eliminando Tarea");
    setRender(!render);
    deleteTask(taskId);
  };

  const getTasks = useCallback(() => {}, [user?.tasks, tasks]);

  

  const handleTaskPress = (Taskname: string) => {
    console.log("Tarea seleccionada:", Taskname);
    router.push({
      pathname: "../taskDetails",
      params: { Taskname },
    });
  };

  // const Save = () => {
  //   console.log("Proyectos guardados:", tasks);
  //   tasks.forEach(task => {
  //     addTask({
  //       name: task.name,
  //       estimated_effort: task.estimated_effort,
  //       list_id: getMainListID()
  //     });
  //   });
  // };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas del proyecto</Text>
      <Text style={styles.projectName}>{projectName}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTask.name}
          onChangeText={(text) => setNewTask({ ...newTask, name: text })}
          placeholder="Nombre de la Tarea"
        />
        <TouchableOpacity style={styles.button} onPress={handleAddTask}>
          <Text style={styles.buttonText}>Añadir Tarea</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectItem}
            onPress={() => handleTaskPress(item.name)}
          >
            <Text>{item.name}</Text>
            <Text>{item.real_effort}</Text>
            <Text>{item.estimated_effort}</Text>
            <Button
              title="Eliminar"
              onPress={() => handleDeleteTask(item._id)}
            />
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item._id.toString()}
      />
      {/* <TouchableOpacity style={styles.button} onPress={Save}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fee8c8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
  },
  projectName: {
    fontSize: 18,
    marginBottom: 10,
  },
  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 25,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    justifyContent: "center",
  },
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});