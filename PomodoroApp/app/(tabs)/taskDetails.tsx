import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";
import { setStatusBarNetworkActivityIndicatorVisible } from "expo-status-bar";

export default function TaskDetails() {
  const { Taskname } = useLocalSearchParams<{ Taskname: string }>();
  const {
    user,
    controllers: {
      TaskController: { getTasksByList, updateTask },
    },
  } = useGlobalContext();
  const [task, setTask] = useState<Task | null>(null);
  const [editedTask, setEditedTask] = useState({
    name: "",
    estimated_effort: 0,
  });

  useEffect(() => {
    if (user) {
      const tasks = getTasksByList(user.lists[0]._id);
      const selectedTask = tasks.find((t) => t.name === Taskname);
      setTask(selectedTask || null);
      if (selectedTask) {
        setEditedTask({
          name: selectedTask.name,
          estimated_effort: selectedTask.estimated_effort,
        });
      }
    }
  }, [Taskname, user]);

  //  const handleTaskPress = (Taskname: string) => {
  //   console.log("Tarea seleccionada:", Taskname);
  //   router.push({
  //     pathname: "../taskDetails",
  //     params: { Taskname },
  //   });
  // };



  const handleSave = () => {
    if (task) {
      updateTask(task._id, editedTask);
    }
  };

  if (!task) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Task Details</Text>
        <Text>Tarea no encontrada</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Task Details</Text>
      
      <View style={styles.container2}>
        <Text style={styles.subtitle}>Name</Text>
        <TextInput
          style={styles.input}
          value={editedTask.name}
          onChangeText={(text) => setEditedTask({ ...editedTask, name: text })}
          placeholder="Nombre de la Tarea"
        />
      </View>

      <View style={styles.container2}>
        <Text style={styles.subtitle}>Effort</Text>
        <TextInput
          style={styles.input}
          value={String(editedTask.estimated_effort)}
          onChangeText={(text) =>
            setEditedTask({ ...editedTask, estimated_effort: Number(text) })
          }
          placeholder="Esfuerzo estimado"
          keyboardType="numeric"
        />
      </View>
      {/* <TouchableOpacity style={styles.button} onPress={Save}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 1,
    backgroundColor: "#fee8c8",
    width: "100%",
    color: "black",
  },
  container2: {
    padding: 10,
    color: "red",
    width: "80%", // Ajusta el ancho del contenedor
    alignSelf: "center", // Centra el contenedor
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 50,
    textAlign : "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 5,
    width: "100%", // Ajusta el ancho del TextInput
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 10,
  },
});
