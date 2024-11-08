import React, { useCallback, useEffect,useState } from 'react'
import {
    View,
    Text,
    TextInput,
    Button,

  } from "react-native";

import util_styles from '@/styles/utils';
import taskList_styles from '@/styles/taskList';
import { useGlobalContext } from '@/context/AppContext';
import { Task } from '@/db/models/Task';

const tareas = () => {

    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<string>("");
    const {
        user,
        controllers:{
            TaskController: {getTasksByList,deleteTask},
            ListController: {getMainListID}}} = useGlobalContext();



          const handleAddTask = () => {
            console.log("Añadiendo Tarea");

          }
    const handleDeleteTask = (taskId: Realm.BSON.ObjectID) => {  
        console.log(taskId.toString(),"Eliminando Tarea");
        
        deleteTask(taskId);
    }


    const getTasks = useCallback(() => {
        if(user?.tasks)setTasks(getTasksByList(getMainListID()));
    },[])

    useEffect(() => {
      if (user?.tasks) {
          // Only update tasks if there's a change in user.tasks
          setTasks(getTasksByList(getMainListID()));
      }
  }, []); // Watch for changes in user.tasks

  return (
    <View style={taskList_styles.container}>
      <Text style={util_styles.title}>Tareas</Text>
      <View>
        <TextInput placeholder="Nueva Tarea" />
        <Button title='Añadir'></Button>
      </View>
      <View>
        {/* {tasks.length > 0 && tasks.map((task) => (
          <View key={task._id.toString()}>
            <Text>{task.name}</Text>
            <Text>{task.real_effort}</Text>
            <Text>{task.estimated_effort}</Text>
            <Button title='Eliminar' onPress={handleDeleteTask.bind(this,task._id)}></Button>
          </View>
        ))} */}
      </View>
    </View>
  )
}

export default tareas
