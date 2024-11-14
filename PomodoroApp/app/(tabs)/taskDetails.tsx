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
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from 'expo-router';

export default function TaskDetails() {
  const [startDate, setStartDate] = useState("");
  const [date, setDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);
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

  // const handleTaskPress = (Taskname: string) => {
  //   console.log("Tarea seleccionada:", Taskname);
  //   router.push({
  //     pathname: "../taskDetails",
  //     params: { Taskname },
  //   });
  // };

  const Save = () => {
    if (task) {
      try {
        
        updateTask(task._id, {
          name: editedTask.name,
          estimated_effort: editedTask.estimated_effort,
          started_at: date,
        });
  
        alert('Cambios guardados correctamente');
        router.back();
      } catch (error) {
        console.error("Error al guardar:", error);
        alert('Error al guardar los cambios');
      }
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

      <View style={styles.container2}>
        <Text style={styles.subtitle}>started_at</Text>
        <TextInput
          style={styles.input}
          value={date.toLocaleDateString()}
          onPressIn={() => setShowPicker(true)}
          editable={true}
        />
        {showPicker && (
          <DateTimePicker
            value={date}
            mode="date"
            onChange={(event, selectedDate) => {
              setShowPicker(false);
              if (selectedDate) {
                setDate(selectedDate);
              }
            }}
          />
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={Save}>
        <Text style={styles.buttonText}>Guardar</Text>
      </TouchableOpacity>
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
    textAlign: "center",
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

  button: {
    backgroundColor: "#ef6548",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },

  buttonText: {
    color: "white",
    justifyContent: "center",
  },
  // input_day: {
  //   height: 40,
  //   borderWidth: 1,
  //   borderColor: '#ccc',
  //   borderRadius: 5,
  //   paddingHorizontal: 10,
  //   marginTop: 5,
  //   backgroundColor: '#fff'
  // }
});
