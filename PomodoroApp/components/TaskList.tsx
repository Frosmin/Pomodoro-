import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {useGlobalContext} from "@/context/AppContext";
import {Task} from "@/db/models/Task";

import taskList_styles from "@/styles/taskList";
import { getPomodoroDuration } from '@/utils/pomodoroCalculations';
import TaskComponent from './TaskComponent';
import util_styles from '@/styles/utils';
import TaskEditer from './TaskEditer';

interface PomodorosLeft{
  donePomodoros: number,
  totalPomodoros : number,
  pomodoroEndTime : string,
}


const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pomosLeft, setPomosLeft] = useState<PomodorosLeft>({pomodoroEndTime: "", totalPomodoros: 0,donePomodoros: 0});
    
    const {
        state,
        user,
        controllers: {
          TaskController: { getTasksByList},
          ListController: { getMainListID, getActiveLists },
          ProjectController: {getProjectList}
        },
      } = useGlobalContext();


      const [open,setOpen] = useState<boolean>(false);

  useEffect(() => {
    if ((user?.tasks, tasks)) {
      // Only update tasks if there's a change in user.tasks
      setTasks(getTasksByList(getMainListID()));
    }
  }, [user]); // Watch for changes in user.tasks

  
  useEffect(() => {
    setPomosLeft(getPomodoroDuration(tasks, state))      
  },[tasks,state]);

  return (
    <View style={taskList_styles.taskCon}>
      <View style={taskList_styles.estimate_container}>
        <View>
          <Text style={[{ fontWeight: 'bold' },util_styles.p]}>Pomodoros:</Text>
          <Text style={[ util_styles.p]}>{pomosLeft.donePomodoros}/{pomosLeft.totalPomodoros}</Text>
        </View>
        <View>
          <Text style={[{ fontWeight: 'bold' },util_styles.p]} >Hora Fin :</Text>
          <Text style={[ util_styles.p]}>{pomosLeft.pomodoroEndTime}</Text>  
        </View>
        
      </View>

      {tasks.length > 0 && tasks.map((task) => (
          <TaskComponent key={task._id.toString()} task={task} />
      ))}
      <TouchableOpacity style={[ open ? util_styles.hide : taskList_styles.addBtnContainer]} onPress={() => setOpen(true)} >
        <View style={taskList_styles.addBtn}  >
            <MaterialIcons name="add-circle" size={24} color="black" />
        </View>
            <Text>Agregar Tarea</Text>
      </TouchableOpacity>
      <TaskEditer open={open} setOpen={setOpen} />
    </View>
              
  )

}


export default TaskList
