import { View, Text, StyleSheet, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from "react";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";

export default function TaskDetails() {
  const { Taskname } = useLocalSearchParams<{ Taskname: string }>();
  const { user, controllers: { TaskController: { getTasksByList, updateTask } } } = useGlobalContext();
  const [task, setTask] = useState<Task | null>(null);
  const [editedTask, setEditedTask] = useState({ name: '', estimated_effort: 0 });

  useEffect(() => {
    if (user) {
      const tasks = getTasksByList(user.lists[0]._id); 
      const selectedTask = tasks.find(t => t.name === Taskname);
      setTask(selectedTask || null);
      if (selectedTask) {
        setEditedTask({ name: selectedTask.name, estimated_effort: selectedTask.estimated_effort });
      }
    }
  }, [Taskname, user]);

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
      <TextInput
        style={styles.input}
        value={editedTask.name}
        onChangeText={(text) => setEditedTask({ ...editedTask, name: text })}
        placeholder="Nombre de la Tarea"
      />
      <TextInput
        style={styles.input}
        value={String(editedTask.estimated_effort)}
        onChangeText={(text) => setEditedTask({ ...editedTask, estimated_effort: Number(text) })}
        placeholder="Esfuerzo estimado"
        keyboardType="numeric"
      />
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fee8c8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 20,
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
    textAlign: "center",
  },
});