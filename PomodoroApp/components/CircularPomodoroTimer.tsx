import { useGlobalContext } from '@/context/AppContext';
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { Svg, Circle } from 'react-native-svg';
import { ActionKind } from '@/context/reducer';
//const icon = require('../../assets/cropped-pomodoro-solo.png');
//const icon = require('../../assets/images/cropped-pomodoro-solo.png');

const CircularPomodoroTimer = () => {
  const [isActive, setIsActive] = useState(false);
  const {state,dispatch} = useGlobalContext();
  const [seconds, setSeconds] = useState(state.timer);


  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      if(seconds === 0 ){
        dispatch({type: ActionKind.SWITCH})
        setIsActive(false);
      }else{
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
    setSeconds(state.timer)
  },[state.timer])

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
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const radius = 100;
  const circumference = 2 * Math.PI * radius;
  const progress = (seconds / state.timer) * circumference;

  return (
    <View style={styles.container}>
      <Svg width={220} height={220}>
        <Circle
          stroke="#e6e6e6"
          fill="none"
          cx="110"
          cy="110"
          r={radius}
          strokeWidth="10"
        />
        <Circle
          stroke="#ff6347"
          fill="none"
          cx="110"
          cy="110"
          r={radius}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
        />
      </Svg>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <View style={styles.buttonContainer}>
        <Button onPress={toggle} title={isActive ? 'Pause' : 'Start'} />
        <Button onPress={reset} title="Reset" />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timer: {
    fontSize: 48,
    marginVertical: 20,
    color: 'white',
  },

  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '40%',

  },
});

export default CircularPomodoroTimer;