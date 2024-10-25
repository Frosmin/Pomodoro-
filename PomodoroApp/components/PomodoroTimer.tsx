// PomodoroApp/components/PomodoroTimer.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const PomodoroTimer = () => {
  const [seconds, setSeconds] = useState(1500); // 25 minutos
  const [elapsedTime, setElapsedTime] = useState(0); // segundos
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive) {
      interval = setInterval(() => {
        setSeconds((seconds) => seconds - 1);
        setElapsedTime((elapsedTime) => elapsedTime + 1);
      }, 1000);
    } else if (!isActive && seconds !== 0) {
      clearInterval(interval!);
    }
    return () => clearInterval(interval!);
  }, [isActive, seconds]);

  const toggle = () => {
    setIsActive(!isActive);
  };

  const reset = () => {
    setSeconds(1500);
    setElapsedTime(0);
    setIsActive(false);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timer}>{formatTime(seconds)}</Text>
      <Text style={styles.elapsedTime}>Tiempo transcurrido: {formatTime(elapsedTime)}</Text>
      <Button onPress={toggle} title={isActive ? 'Pause' : 'Start'} />
      <Button onPress={reset} title="Reset" />
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
    marginBottom: 20,
    color: 'white',
  },
  elapsedTime: {
    fontSize: 24,
    marginBottom: 20,
    color: 'red',
  },
});

export default PomodoroTimer;