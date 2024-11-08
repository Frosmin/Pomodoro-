import React, { useEffect,useState } from 'react'
import {
    View,
    Text,

  } from "react-native";

import util_styles from '@/styles/utils';
import taskList_styles from '@/styles/taskList';
import { useGlobalContext } from '@/context/AppContext';

const tareas = () => {

    const {
        controllers:{
            TaskController: {getTasksByList},
            ListController: {getMainListID}}} = useGlobalContext();

    const tasks = getTasksByList(getMainListID());


  useEffect(() => {
    console.log(tasks[0]._id.toString(),"tasks");
    
  },[tasks])

  return (
    <View style={taskList_styles.container}>
      <Text style={util_styles.title}>Tareas</Text>
      <View>
        {tasks.map((task) => (
          <View key={task._id.toString()}>
            <Text>{task.name}</Text>
          </View>
        ))}
      </View>
    </View>
  )
}

export default tareas
