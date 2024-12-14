// PomodoroApp/app/(tabs)/index.tsx
import { Image, StyleSheet, Platform} from 'react-native';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import CircularPomodoroTimer from '@/components/CircularPomodoroTimer';
import { useGlobalContext } from '@/context/AppContext';
import { useEffect } from 'react';
import { useObject, useQuery, useRealm } from '@realm/react';
import { User } from '@/db/models/User';
import { Realm } from '@realm/react';
import TaskList from '@/components/TaskList';
import { ImageBackground,View,ScrollView } from 'react-native';


export default function HomeScreen() {
  const imagenBackg = {
    uri: "https://img.freepik.com/premium-photo/abstract-square-picture-form-glowing-red-circle-isolated-black-background_1028938-468836.jpg",
  };

  return (
    <ScrollView contentContainerStyle={styles.outer} nestedScrollEnabled={true}>
        <CircularPomodoroTimer />
        <TaskList/>
    </ScrollView>

  );
}

const styles = StyleSheet.create({
  outer:{
    backgroundColor: "#fee8c8",
    alignItems: 'center',
    justifyContent: 'center',
    gap: 0,
    paddingVertical: 100,
  },
  inner: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  container: {
    flex: 1,
    backgroundColor: "#fee8c8",
    alignItems: 'center',
    justifyContent: 'center',
    gap:0,
  },
  image: {
    flex: 1,
    justifyContent: "center",
  },
  text: {
    fontSize: 20,
    color: '#333',
    marginBottom: 20,
  },
  link: {
    color: '#1B95E0',
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  wave: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },

});