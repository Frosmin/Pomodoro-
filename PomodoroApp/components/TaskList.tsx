import React, { useState } from 'react';
import { View, Text, Button } from 'react-native';
//import { Task } from './types'; // Asegúrate de que la ruta sea correcta

interface Task {
  id: number;
  name: string;
  completedPomodoros: number;
  totalPomodoros: number;
}

const TaskList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: 1, name: 'Task 1', completedPomodoros: 0, totalPomodoros: 2 },
    { id: 2, name: 'Task 2', completedPomodoros: 1, totalPomodoros: 3 },
  ]);

  const handlePomodoroComplete = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId && task.completedPomodoros < task.totalPomodoros
          ? { ...task, completedPomodoros: task.completedPomodoros + 1 }
          : task
      )
    );
  };

  return (
    <View>
      <Text style={{ fontSize: 20, marginBottom: 10 }}>Tasks</Text>
      {tasks.map((task) => (
        <View key={task.id} style={{ marginBottom: 15 }}>
          <Text>
            {task.name}: {task.completedPomodoros}/{task.totalPomodoros}
          </Text>
          <Button
            onPress={() => handlePomodoroComplete(task.id)}
            title="Complete Pomodoro"
            disabled={task.completedPomodoros >= task.totalPomodoros}
          />
        </View>
      ))}
    </View>
  );
};

export default TaskList;


