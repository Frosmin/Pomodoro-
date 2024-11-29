import util_styles from '@/styles/utils'
import React,{useEffect, useState} from 'react'
import {Text, TouchableOpacity, View} from 'react-native'
import { Task } from '@/db/models/Task'
import { ListTypes } from '@/db/models/List'
import { useGlobalContext } from '@/context/AppContext'
import TaskComponent from '@/components/TaskComponent'
import { colors } from '@/styles/colors'
import ActivityTask from '@/components/ActivityInventory/ActivityTask'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import taskList_styles from '@/styles/taskList'
const activityInventory = () => {

const [tasks, setTasks] = useState<Task[]>([]);
const [tasksChecked, setTasksChecked] = useState<boolean[]>();

const {
    state,
    user,
    controllers: {
      TaskController: { getTaskByListType, changeListType },
    },
  } = useGlobalContext();

  const checkTask = (index: number) => { 
    console.log(index);
    
    if (tasksChecked === undefined) {
      return;
    }
    setTasksChecked(

      tasksChecked.map((taskChecked, i) => {
        if (i === index) {
          return !taskChecked;
        }
        return taskChecked;
      })
    )
  };

  const sendToMain = () => {
    const task_ids = tasksChecked?.map((taskChecked, index) => {
      if (taskChecked) {
        return tasks[index]._id;
      }
      return null;
    });
    if(task_ids === undefined) return
    changeListType(task_ids.filter((task_id) => task_id !== null), ListTypes.MAIN);
  }

  useEffect(() => {
    if (user) {
      console.log("changing activity inventory");
      const tempTasks : Task[] = getTaskByListType(ListTypes.OTHER);
      setTasks(tempTasks);
      setTasksChecked(Array(tempTasks.length).fill(false));
    }
  },[user])




  return (
    <View style={[util_styles.container, util_styles.g_5,{backgroundColor: colors.secondary}]}>
      <Text style={[util_styles.title]}>Inventario de actividades</Text>

      <View style={[util_styles.flex_column, util_styles.g_2]}>
        {tasksChecked?.length && tasks.length ? (tasks.map((task, index) => (
            <ActivityTask key={index} task={task}  index={index} isChecked={tasksChecked[index]} checkTask={checkTask} />
        ))):(
          <>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={32} color="black" />
            <Text style={[util_styles.h3]}>No hay actividades en el inventario de actividades</Text>      
          </>)
        }
      </View>
      
      <TouchableOpacity style={[util_styles.btn, util_styles.btn_primary]} onPress={sendToMain}>
        <Text >Enviar a la lista</Text>
      </TouchableOpacity>
    </View>
  )
}

export default activityInventory
