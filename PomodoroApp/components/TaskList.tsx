import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {useGlobalContext} from "@/context/AppContext";
import {Task,TaskStatus} from "@/db/models/Task";
import { Project } from '@/db/models/Project';
import { List } from '@/db/models/List';
import taskList_styles from "@/styles/taskList";
import { getPomodoroDuration } from '@/utils/pomodoroCalculations';
import TaskComponent from './TaskComponent';
import util_styles from '@/styles/utils';
import TaskEditer from './TaskEditer';



const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);


    
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
    getPomodoroDuration(tasks, state);
  },[tasks])

  return (
    <View style={taskList_styles.taskCon}>
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
