import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {useGlobalContext} from "@/context/AppContext";
import {Task} from "@/db/models/Task";
import { ListTypes } from '@/db/models/List';

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

interface OptionInterface{
  name: string,
  onPress: () => void,
  icon: "selection-ellipse-remove" | "trash-can-outline"
}


const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [pomosLeft, setPomosLeft] = useState<PomodorosLeft>({pomodoroEndTime: "", totalPomodoros: 0,donePomodoros: 0});
    const [openOptions, setOpenOptions] = useState<boolean>(false);
    const [open,setOpen] = useState<boolean>(false);
    const {controllers: {TaskController : {removeCompletedTasks,removeAllTasks}}} = useGlobalContext();


    const handleDeleteCompleted = () => {
      getTasksByList(getListIdByType(ListTypes.MAIN)).forEach((task) => {
        if (task.status === "FINISHED") {
          removeCompletedTasks();
        }
      });
    };

    const options: OptionInterface[] = [
      {
        name: "Eliminar Completadas",
        onPress: () => removeCompletedTasks(),
        icon: "selection-ellipse-remove",
      },
      {
        name: "Eliminar Todas",
        onPress: () => removeAllTasks(),
        icon: "trash-can-outline",
      },
    ];

    const {
        state,
        user,
        controllers: {
          TaskController: { getTasksByList},
          ListController: { getListIdByType, getActiveLists },
          ProjectController: {getProjectList}
        },
      } = useGlobalContext();



  useEffect(() => {
    if ((user?.tasks, tasks)) {
      // Only update tasks if there's a change in user.tasks
      setTasks(getTasksByList(getListIdByType(ListTypes.MAIN)));
    }
  }, [user]); // Watch for changes in user.tasks

  
  useEffect(() => {
    setPomosLeft(getPomodoroDuration(tasks, state))      
  },[tasks,state]);

  return (
    <View style={taskList_styles.taskCon}>
      
      <View style={taskList_styles.tasks_header}>
        <Text style={[{ fontWeight: 'bold' },util_styles.h4]}>Lista de Tareas</Text>
        <TouchableOpacity onPress={() => setOpenOptions(!openOptions)}>
          <MaterialCommunityIcons name="format-list-bulleted" size={24} color="black" />
        </TouchableOpacity>
      </View>
      {openOptions && 
      <View style={taskList_styles.options_container}>
            {options.map((option) => (
              <TouchableOpacity key={option.name} onPress={option.onPress} style={taskList_styles.option}>
                <MaterialCommunityIcons name={option.icon} size={24} color="black" />
                <Text style={util_styles.p}>{option.name}</Text>
              </TouchableOpacity>
            ))}
      </View>
 }

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
    </View>
              
  )

}


export default TaskList
