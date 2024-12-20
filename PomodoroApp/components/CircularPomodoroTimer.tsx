import { useGlobalContext } from "@/context/AppContext";
import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ImageBackground,
} from "react-native";
import { Svg, Circle } from "react-native-svg";
import { ActionKind } from "@/context/reducer";
import { PomodoroState } from "@/context/reducer";
import { Pomodoro, PomodoroStatus } from "@/db/models/Pomodoro";
import { DisctractionType } from "@/db/Controllers/PomodoroController";
import Entypo from '@expo/vector-icons/Entypo';
import util_styles from "@/styles/utils";
import { showNotification,showPersistentNotification } from "@/utils/NotificationService";
import AsyncStorage from '@react-native-async-storage/async-storage';

import * as Notifications from "expo-notifications";
import { Audio } from 'expo-av';


enum TimerStatus {
  NOT_STARTED = "NOT_STARTED",
  IN_PROGRESS = "IN_PROGRESS",
  PAUSED = "PAUSED",
}
//

const CircularPomodoroTimer = () => {

  const [timerStatus, setTimerStatus] = useState<TimerStatus>(TimerStatus.NOT_STARTED);
  const {
    state,
    dispatch,
    user,
    controllers: {
      TaskController: {incrementEffort },
      PomodoroController: { addPomodoro, changePomodoroStatus, scoreDistraccion },
    },
  } = useGlobalContext();
  const [currentPomodoro,setCurrentPomodoro] = useState<Pomodoro|null>(null);



  const [seconds, setSeconds] = useState(0);
  //const imagenBackg = {source: require("@/assets/images/cropped-pomodoro-solo.png")};
  


  useEffect(() => {
    if(timerStatus === TimerStatus.NOT_STARTED && seconds === 0){
      switch(state.status){
        case PomodoroState.FOCUS:
          setSeconds(state.params.focusTime);
          break;
        case PomodoroState.BREAK:
          setSeconds(state.params.breakTime);
          break;
        case PomodoroState.LONG_BREAK:
          setSeconds(state.params.longBreakTime);
          break;
      }
    }
  },[state])


  const toggle = () => {

    if(state.status === PomodoroState.FOCUS &&  timerStatus === TimerStatus.NOT_STARTED){
      const response = addPomodoro(state.activeTask,state.timer / 60);

      
      if(response.status === "error"){
        alert(response.message);
      }else{
        const pomodoro_id = response.pomodoro_id;
        dispatch({ type: ActionKind.SET_POMODORO, payload: pomodoro_id.toString() });
        AsyncStorage.setItem("currentPomodoro", pomodoro_id.toString());
      }
    }
    setTimerStatus(
      timerStatus === TimerStatus.PAUSED || timerStatus === TimerStatus.NOT_STARTED
        ? TimerStatus.IN_PROGRESS
        : TimerStatus.PAUSED
    );
  };

  const reset = () => {
    if(timerStatus === TimerStatus.IN_PROGRESS ){
      setSeconds(state.timer);
      AsyncStorage.setItem("seconds", state.timer.toString());
      setTimerStatus(TimerStatus.NOT_STARTED);
      console.log(state.currentPomodoro);
      if(state.status === PomodoroState.FOCUS){
        changePomodoroStatus(state.currentPomodoro, PomodoroStatus.CANCELED);
      }
    }
    
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const incrementPomodoro = () => {
    incrementEffort(state.activeTask);

  }; 

  //Sonidos :D
  const [sound, setSound] = useState<Audio.Sound | null>(null);
  const playSound = async (type: 'tick' | 'alarm') => {
    try {
      const { sound: newSound } = await Audio.Sound.createAsync(
          require('@/assets/sounds/alarm2.wav'),
        { shouldPlay: true }
      );
      setSound(newSound);
      await newSound.playAsync();
    } catch (error) {
      console.error('Error reproduciendo sonido:', error);
    }
  };
  // Limpieza del sonido
  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  

  // UseEffect para manejar los intervalos de tiempo
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (timerStatus === TimerStatus.IN_PROGRESS) {
      
      showPersistentNotification(formatTime(seconds),state.status);

      if (seconds === 0) {
        playSound('alarm'); // Reproducir sonido de alarma

        if (state.status !== PomodoroState.BREAK && state.status !== PomodoroState.LONG_BREAK) {
            incrementPomodoro(); // Incrementa el contador solo al final de un ciclo completo
            changePomodoroStatus(state.currentPomodoro, PomodoroStatus.FINISHED);
            dispatch({ type: ActionKind.SET_POMODORO, payload: "" });
            setCurrentPomodoro(null);
            AsyncStorage.setItem("currentPomodoro", "");
        }
        dispatch({ type: ActionKind.SWITCH });
        setTimerStatus(TimerStatus.NOT_STARTED);
      } else {
        interval = setInterval(() => {
          setSeconds((seconds) => seconds - 1);
          AsyncStorage.setItem("seconds", (seconds - 1).toString());
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
    if (user?.pomodoros && state.currentPomodoro) {
      setCurrentPomodoro(user.pomodoros[state.currentPomodoro]);
    }
  },[user,state.currentPomodoro]);

  useEffect(() => {
    const loadSeconds = async () => {
      const savedSeconds = await AsyncStorage.getItem("seconds").then((res) => res);  
      if (savedSeconds !== null) {
        setSeconds(parseInt(savedSeconds));
      }

    }
    loadSeconds();

  }, []);


 



  const radius = 120; // Nuevo radio
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / state.timer ) * circumference;

  return (
    
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
          <Text style={[{ position: "absolute", top: "10%"}, util_styles.t_white]}>#{state.nIntervals}</Text>
          <Text style={styles.timer}>{formatTime(seconds)}</Text>
        </View>
        {/* Contenedor de botones */}

        <View style={styles.buttonContainer}>
          <View style={util_styles.flex_column}>
            <Text style={[util_styles.p,{fontWeight: "bold"}]}>DI</Text>
            <TouchableOpacity style={util_styles.chip} onPress={() => {
              if (state.currentPomodoro) {
                scoreDistraccion(state.currentPomodoro, DisctractionType.INTERNAL);
              } else {
                console.warn("No active Pomodoro to record internal distraction.");
              }
              }}>
              <Text style={[util_styles.p,util_styles.t_white,{fontWeight: "bold"}]}>{currentPomodoro ? currentPomodoro.internal_distraction : 0}</Text>
            </TouchableOpacity>
          </View>
          
        
          <TouchableOpacity style={[util_styles.btn,util_styles.btn_primary]} onPress={toggle}>
            <Text style={util_styles.p}>
              {timerStatus === TimerStatus.NOT_STARTED ? "Iniciar" : 
              timerStatus === TimerStatus.IN_PROGRESS ? "Pausar" : "Reanudar"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={[util_styles.btn,util_styles.btn_outlined_primary]}  onPress={reset}>
            <Text style={util_styles.p}> Cancelar</Text>
          </TouchableOpacity> 

          <View style={util_styles.flex_column}>
            <Text style={[util_styles.p,{fontWeight: "bold"}]}>DE</Text>
            <TouchableOpacity style={util_styles.chip} onPress={() => {
              if (state.currentPomodoro) {
                scoreDistraccion(state.currentPomodoro, DisctractionType.EXTERNAL);
              } else {
                console.warn("No active Pomodoro to record distraction.");
              }
              }}>
              <Text style={[util_styles.p,util_styles.t_white,{fontWeight: "bold"}]}>{currentPomodoro ? currentPomodoro.external_distraction : 0}</Text>
            </TouchableOpacity>
          </View>
          
        </View>
      </View>
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
    display: "flex",
    gap: 20,
    // width: "60%",
    // height: "15%",
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
  
  
});

export default CircularPomodoroTimer;
