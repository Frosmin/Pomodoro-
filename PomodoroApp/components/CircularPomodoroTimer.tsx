import { useGlobalContext } from "@/context/AppContext";
import React, { useState, useEffect } from "react";
import {
  View,
  Button,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
  ScrollView,
} from "react-native";
import { Svg, Circle } from "react-native-svg";
import { ActionKind } from "@/context/reducer";
import Button1 from "./UI/Button1";
import { PomodoroState } from "@/context/reducer";
//const icon = require('../../assets/cropped-pomodoro-solo.png');
//const icon = require('../../assets/images/cropped-pomodoro-solo.png');

const CircularPomodoroTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const { state, dispatch } = useGlobalContext();
  const [seconds, setSeconds] = useState(state.timer);
  //const imagenBackg = {source: require("@/assets/images/cropped-pomodoro-solo.png")};
  const imagenBackg = {
    uri: "https://img.freepik.com/premium-photo/abstract-square-picture-form-glowing-red-circle-isolated-black-background_1028938-468836.jpg",
  };
//----------------------------
interface Task {
  id: number;
  name: string;
  completedPomodoros: number;
  totalPomodoros: number;
}
const [tasks, setTasks] = useState<Task[]>([
  { id: 1, name: 'tarea 1', completedPomodoros: 0, totalPomodoros: 2 },
  { id: 2, name: 'tarea 2', completedPomodoros: 0, totalPomodoros: 6 },
  { id: 3, name: 'tarea 3', completedPomodoros: 0, totalPomodoros: 6 },
  { id: 4, name: 'tarea 4', completedPomodoros: 0, totalPomodoros: 7 },
  { id: 5, name: 'tarea 5', completedPomodoros: 0, totalPomodoros: 3 },
  { id: 6, name: 'tarea 6', completedPomodoros: 0, totalPomodoros: 3 },
  //{ id: 7, name: 'tarea 7', completedPomodoros: 0, totalPomodoros: 3 },
  //{ id: 8, name: 'tarea 8', completedPomodoros: 0, totalPomodoros: 3 },
  //{ id: 9, name: 'tarea 9', completedPomodoros: 0, totalPomodoros: 3 },
  //{ id: 10, name: 'tarea 10', completedPomodoros: 0, totalPomodoros: 3 },
  //{ id: 11, name: 'tarea 11', completedPomodoros: 0, totalPomodoros: 3 },
  //{ id: 12, name: 'tarea 12', completedPomodoros: 0, totalPomodoros: 3 },
  //{ id: 13, name: 'tarea 13', completedPomodoros: 0, totalPomodoros: 3 },
]);

//----------------------------

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      if (seconds === 0) {
        if (state.status === PomodoroState.BREAK || state.status === PomodoroState.LONG_BREAK) {
          incrementPomodoro(); // Incrementa el contador solo al final de un ciclo completo
        }
        dispatch({ type: ActionKind.SWITCH });
        setIsActive(false);
      } else {
        interval = setInterval(() => {
          setSeconds((seconds) => seconds - 1);
        }, 1000);
      }
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    
    return () => clearInterval(interval!);
  }, [isActive, seconds]);

  useEffect(() => {
    setSeconds(state.timer);
  }, [state.timer]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(state.timer);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };
  //--------------------------
  const incrementPomodoro = () => {
    setTasks((prevTasks) =>
      prevTasks.map((task, index) =>
        index === 0 // Suponiendo que solo se actualiza la tarea activa (la primera)
          ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
          : task
      )
    );
  }; 
  
  //--------------------------


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
              {isActive ? " Pause" : "   Start"}{" "}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={reset}>
            <Text style={styles.textButton}> Reset</Text>
          </TouchableOpacity>
        </View>
        {/* vista de tareas */}
        <View style={styles.taskCon}>
            {tasks.map((task) => (
              <View key={task.id} style={styles.taskContainer}>
                <Text>{task.name}</Text>
                  <Text>
                    {task.completedPomodoros} / {task.totalPomodoros}
                  </Text>
              </View>
              ))}
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
    borderRadius: 10,
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
    borderRadius: 8,
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
    padding: 10,
    marginBottom: 5,
    backgroundColor: '#ef6548', //color tareas
    borderRadius: 5,
  },
  taskCon: {
    display: "flex",
    width: "50%",
    height: "6%",
  }
});

export default CircularPomodoroTimer;
