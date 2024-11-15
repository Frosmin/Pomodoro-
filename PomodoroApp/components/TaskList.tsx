import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {useGlobalContext} from "@/context/AppContext";
import {Task,TaskStatus} from "@/db/models/Task";
import taskList_styles from "@/styles/taskList";
import { getPomodoroDuration } from '@/utils/pomodoroCalculations';
import TaskComponent from './TaskComponent';


interface NewTask {
    name: string;
    estimated_effort: number;
  }

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<NewTask>({
      name: "",
      estimated_effort: 1,
    });
    const {
        state,
        dispatch,
        user,
        controllers: {
          TaskController: { getTasksByList, deleteTask, addTask },
          ListController: { getMainListID },
        },
      } = useGlobalContext();

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

  return (
    <View style={taskList_styles.taskCon}>
            {tasks.length > 0 && tasks.map((task) => (
                <TaskComponent task={task} />
            ))}
              <View style={taskList_styles.addBtnContainer} >
                <TextInput
                  placeholder="Nueva Tarea"
                  value={newTask.name}
                  onChangeText={(text) => setNewTask({ name: text, estimated_effort: 1 })}
                />
                <TouchableOpacity style={taskList_styles.addBtn}  onPress={handleAddTask}>
                  <MaterialIcons name="add-task" size={24} color="black" />
                </TouchableOpacity>
              </View>
        </View>
  )

}


export default TaskList
