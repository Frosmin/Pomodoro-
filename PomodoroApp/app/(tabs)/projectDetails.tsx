
/**
 * ProjectDetails component displays the details of a project and allows the user to add tasks to the project.
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @remarks
 * This component uses React Native components such as View, Text, TextInput, TouchableOpacity, and FlatList.
 * It also uses hooks from 'expo-router' and React.
 * 
 * @component
 * 
 * @example
 * // Example usage:
 * // <ProjectDetails />
 * 
 * @function
 * @name ProjectDetails
 * 
 * @description
 * The ProjectDetails component fetches the project name from the local search parameters and maintains a list of tasks.
 * It provides an input field to add new tasks and displays the list of tasks. Each task can be pressed to navigate to the task details screen.
 * 
 * @returns {JSX.Element} The rendered component.
 */
import { View, Text, StyleSheet,TextInput,TouchableOpacity,FlatList, } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from "react";
import { router } from "expo-router";


export default function ProjectDetails() {
  const { projectName } = useLocalSearchParams<{ projectName: string }>();
  const [tasks, setTask] = useState<string[]>([]);
  const [newTask, setNewTask] = useState("");

  const addTask = () => {
    if (newTask.trim()) {
      setTask([...tasks, newTask.trim()]);
      setNewTask("");
    }
  };

  const handleTaskPress = (Taskname: string) => {
    console.log('Tarea seleccionada:', Taskname);
    router.push({
      pathname: "../taskDetails",
      params: { Taskname }
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tareas del proyecto</Text>
      <Text style={styles.projectName}>{projectName}</Text>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={newTask}
          onChangeText={setNewTask}
          placeholder="Nombre de la Tarea"
        />
        <TouchableOpacity style={styles.button} onPress={addTask}>
          <Text style={styles.buttonText}>Añadir Proyecto</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={tasks}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.projectItem}
            onPress={() => handleTaskPress(item)}
          >
            <Text>{item}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item, index) => index.toString()}
      />
  
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
  },
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  
});