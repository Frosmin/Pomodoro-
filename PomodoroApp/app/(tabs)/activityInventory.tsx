import util_styles from '@/styles/utils'
import React,{useEffect, useState} from 'react'
import {Text, View} from 'react-native'
import { Task } from '@/db/models/Task'
import { ListTypes } from '@/db/models/List'
import { useGlobalContext } from '@/context/AppContext'
import TaskComponent from '@/components/TaskComponent'
import { colors } from '@/styles/colors'

const activityInventory = () => {

const [tasks, setTasks] = useState<Task[]>([]);

const {
    state,
    user,
    controllers: {
      TaskController: { getTaskByListType},
    },
  } = useGlobalContext();

  useEffect(() => {
    if (user) {
      setTasks(getTaskByListType(ListTypes.OTHER));
    }
  },[user])

  useEffect(() => {
    console.log("inventory",tasks);
  },[tasks])

  return (
    <View style={[util_styles.container]}>
      <Text style={[util_styles.title,util_styles.t_white]}>Inventario de actividades</Text>

      {tasks.map((task, index) => (
          <TaskComponent key={index} task={task} backgroundColor={colors.white}/>
      ))}
    
    </View>
  )
}

export default activityInventory
