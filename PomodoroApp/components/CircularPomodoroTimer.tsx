import { useGlobalContext } from "@/context/AppContext";
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  TextInput,
  ScrollView
} from "react-native";
import Realm from "realm"
import { Svg, Circle } from "react-native-svg";
import { ActionKind } from "@/context/reducer";
import { PomodoroState } from "@/context/reducer";
import { Task, TaskStatus} from "@/db/models/Task";
//const icon = require('../../assets/cropped-pomodoro-solo.png');
//const icon = require('../../assets/images/cropped-pomodoro-solo.png');
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useObject } from "@realm/react";
import { getPomodoroDuration } from "@/utils/pomodoroCalculations";
import { PomodoroStatus } from "@/db/models/Pomodoro";
interface NewTask {
  name: string;
  estimated_effort: number;
}

enum TimerStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
}
//

const CircularPomodoroTimer = () => {

  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTask, setNewTask] = useState<NewTask>({
    name: "",
    estimated_effort: 1,
  });


  const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.NOT_STARTED);
  const {
    state,
    dispatch,
    user,
    controllers: {
      TaskController: { getTasksByList, deleteTask, addTask,incrementEffort,changeTaskStatus },
      ListController: { getMainListID },
      PomodoroController: { addPomodoro, changePomodoroStatus },
    },
  } = useGlobalContext();



  const [seconds, setSeconds] = useState(state.timer);
  //const imagenBackg = {source: require("@/assets/images/cropped-pomodoro-solo.png")};
  const imagenBackg = {
    uri: "https://img.freepik.com/premium-photo/abstract-square-picture-form-glowing-red-circle-isolated-black-background_1028938-468836.jpg",
  };

  const handleAddTask = () => {
    if (newTask.name.trim() !== "") {
      console.log("Añadiendo Tarea");
      addTask(
        {
        name: newTask.name,
        estimated_effort: 1,
        list_id: getMainListID(),
      });
      setNewTask({ name: "", estimated_effort: 1});
    }
  };

  const handleDeleteTask = (taskId: Realm.BSON.ObjectID) => {
    console.log(taskId.toString(), "Eliminando Tarea");
    deleteTask(taskId);
  };
  //
  const handleToggleTaskCompletion = (taskId: Realm.BSON.ObjectID) => {
    changeTaskStatus(taskId.toString());
  };
  //

  
  const toggle = () => {
    if(state.status === PomodoroState.FOCUS &&  timerStatus === TimerStatus.NOT_STARTED){
      const response = addPomodoro(state.activeTask);
      console.log(response,"Response");
      
      if(response.status === "error"){
        alert(response.message);
      }else{
        const pomodoro_id = response.pomodoro_id;
        dispatch({ type: ActionKind.SET_POMODORO, payload: pomodoro_id.toString() });

      }
    }
    setTimerStatus(
      timerStatus === TimerStatus.PAUSED || timerStatus === TimerStatus.NOT_STARTED
        ? TimerStatus.IN_PROGRESS
        : TimerStatus.PAUSED
    );
  };

  const reset = () => {
    setSeconds(state.timer);
    setTimerStatus(TimerStatus.NOT_STARTED);
    changePomodoroStatus(state.currentPomodoro, PomodoroStatus.CANCELED);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  //--------------------------
  const incrementPomodoro = () => {
    incrementEffort(state.activeTask);

  }; 
  
  //--------------------------

  const selectActiveTask = (task_id: Realm.BSON.ObjectID) => {
    console.log("selecting", task_id.toString());
    
    dispatch({ type: ActionKind.SET_CURRENT, payload: task_id.toString() });
  };

  //UseEffect para manejar los intervalos de tiempo
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerStatus === TimerStatus.IN_PROGRESS) {
      if (seconds === 0) {
        if (state.status !== PomodoroState.BREAK && state.status !== PomodoroState.LONG_BREAK) {
            incrementPomodoro(); // Incrementa el contador solo al final de un ciclo completo
            changePomodoroStatus(state.currentPomodoro, PomodoroStatus.FINISHED);
            dispatch({ type: ActionKind.SET_POMODORO, payload: "" });
        }
        dispatch({ type: ActionKind.SWITCH });
        setTimerStatus(TimerStatus.NOT_STARTED);
      } else {
        interval = setInterval(() => {
          setSeconds((seconds) => seconds - 1);
        }, 1000);
      }
    } else if (timerStatus === TimerStatus.NOT_STARTED && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [timerStatus, seconds]);

  useEffect(() => {
    setSeconds(state.timer);
  }, [state.timer]);

  useEffect(() => {
    if ((user?.tasks, tasks)) {
      // Only update tasks if there's a change in user.tasks
      setTasks(getTasksByList(getMainListID()));
      console.log("rendering tasks");
      
    }
  }, [user]); // Watch for changes in user.tasks

  
  useEffect(() => {
    getPomodoroDuration(tasks, state);
  },[tasks])

  

  const radius = 120; // Nuevo radio
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / state.timer) * circumference;

  return (
    <ImageBackground
      source={imagenBackg}
      resizeMode="cover"
      style={styles.image}
    >
      <View style={styles.container}>
        <View style={styles.status_container}>
          {Object.values(PomodoroState).map((status) => (
            <View
              key={status}
              style={[
                styles.status_box,
                state.status === status && styles.active_status,
              ]}
            >
              <Text>
                {status.charAt(0) +
                  status.slice(1).toLowerCase().replace("_", " ")}
              </Text>
            </View>
          ))}
        </View>
        {/* Fondo circular y temporizador en un contenedor */}

        <View style={styles.timerContainer}>
          <View style={styles.circle} />
          <Svg width={radius * 2 + 20} height={radius * 2 + 20}>
            <Circle
              stroke="#d7301f" // color del circulo
              fill="none"
              cx={radius + 10}
              cy={radius + 10}
              r={radius}
              strokeWidth="13"
            />
            <Circle
              stroke="#7f0000" // color del progreso
              fill="none"
              cx={radius - 30}
              cy={radius - 30}
              r={radius}
              strokeWidth="13"
              strokeDasharray={circumference}
              strokeDashoffset={progress}
              transform="rotate(180 110 110)"
            />
          </Svg>
          <Text style={styles.timer}>{formatTime(seconds)}</Text>
        </View>
        {/* Contenedor de botones */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggle}>
            <Text style={styles.textButton}>
              {" "}
              {timerStatus === TimerStatus.NOT_STARTED ? "Iniciar" : 
              timerStatus === TimerStatus.IN_PROGRESS ? "Pausar" : "Reanudar"}{" "}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.textButton}> Cancelar</Text>
          </TouchableOpacity>
        </View>
        {/* vista de tareas */}
        <View style={styles.taskCon}>
          <ScrollView style={styles.taskScroll}>
            {tasks.length > 0 && tasks.map((task) => (
                <View key={task._id.toString()} style={[styles.taskContainer,state.activeTask === task._id.toString() ? styles.active_task : null]} onStartShouldSetResponder={(event) => {selectActiveTask(task._id);return true;}}>
                  <TouchableOpacity onPress={() => handleToggleTaskCompletion(task._id)}>
                    <MaterialCommunityIcons name={task.status=== TaskStatus.FINISHED ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}  size={24} color="black" />
                  </TouchableOpacity>
                
                  <Text style={task.status=== TaskStatus.FINISHED ? { textDecorationLine: 'line-through' } : {}}>{task.name}</Text>
                  <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", gap: 10 }}>
                    <Text>
                        {task.real_effort} / {task.estimated_effort}
                      </Text>
                    <TouchableOpacity onPress={() => handleDeleteTask(task._id)}>
                      <Ionicons name="trash" size={16} color="black" />
                    </TouchableOpacity>
                    </View>      
                </View>
              ))}
              </ScrollView>
              <View style={styles.addBtnContainer}>
                <TextInput
                  placeholder="Nueva Tarea"
                  value={newTask.name}
                  onChangeText={(text) => setNewTask({ name: text, estimated_effort: 1 })}
                />
                <TouchableOpacity style={styles.addBtn}  onPress={handleAddTask}>
                  <MaterialIcons name="add-task" size={24} color="black" />
                </TouchableOpacity>
              </View>
        </View>
        {/* --------------- */}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fee8c8", //fondo de toda la app-si pongo backgroun quitar
  },
  timerContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10, // Espacio para los botones
    //backgroundColor: 'yellow',
  },
  timer: {
    position: "absolute",
    fontSize: 60,
    top: "35%",
    color: "#fee8c8",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "50%",
    height: "6%",
  },
  button: {
    backgroundColor: "#ef6548",
    marginHorizontal: 10,
    borderRadius: 5,
    marginBottom: 5,
    flex: 1,
    margin: 10,
    color: "red",
    alignContent: "center",
    justifyContent: "center",
    paddingHorizontal: 0,
    paddingVertical: 0,
    opacity: 0.8,
    shadowColor: "white",
    elevation: 5,
  },
  textButton: {
    color: "black", //texto Star Reset
    fontSize: 25,
  },

  circle: {
    position: "absolute",
    width: 240,
    height: 240,
    borderRadius: 120,
    backgroundColor: "#ef6548", // Fondo del circulo
  },
  status_container: {
    display: "flex",
    flexDirection: "row",
    gap: 20,
    marginBottom: 20,
  },
  status_box: {
    //backgroundColor: '#ef6548',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
    marginBottom: 5,
    opacity: 0.8,
  },
  active_status: {
    backgroundColor: "#ef6548",
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  taskContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 5,
    backgroundColor: '#ef6548', //color tareas
    borderRadius: 5,
  },
  taskCon: {
    height: 200, // Ajusta esta altura según lo necesario
    width: "60%",
    //backgroundColor: "white",
    paddingTop: 20,
  },
  list: {
    flexGrow: 0,
  },
  taskScroll: {
    height: 200, // Limitar el tamaño del área de scroll
  },
  active_task:{
    backgroundColor: "#c53f27",
  },
  addBtnContainer: {
    backgroundColor: "#ef6538",
    display: "flex",
    flexDirection: "row",
    gap: 75,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderStyle: "dashed",
    borderColor:"#fff",
    borderWidth: 1,
  },
  addBtn: {
    backgroundColor: "transparent"
  }
});

export default CircularPomodoroTimer;
