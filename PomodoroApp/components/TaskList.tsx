import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {useGlobalContext} from "@/context/AppContext";
import {Task,TaskStatus} from "@/db/models/Task";
import { Project } from '@/db/models/Project';
import taskList_styles from "@/styles/taskList";
import { getPomodoroDuration } from '@/utils/pomodoroCalculations';
import TaskComponent from './TaskComponent';
import util_styles from '@/styles/utils';

interface NewTask {
    name: string;
    estimated_effort: number;
    list_id: number; // 1: lista principal, 2 : inventario de actividades
    project_id: string; // 0 Sin proyecto
  }

const TaskList = () => {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [newTask, setNewTask] = useState<NewTask>({
      name: "",
      estimated_effort: 1,
      list_id: 1,
      project_id: "0",
    });
    const {
        state,
        dispatch,
        user,
        controllers: {
          TaskController: { getTasksByList, deleteTask, addTask },
          ListController: { getMainListID },
          ProjectController: {getProjectList}
        },
      } = useGlobalContext();


      const [listItems, setListItems] = useState([
        { label: 'Principal', value: 1 },
        { label: 'Inventario', value: 2 },
      ])
      const [projectList,setProjectList] = useState<Project[]>([])

      const handleAddTask = () => {
        if (newTask.name.trim() !== "") {
          console.log("Añadiendo Tarea");
          addTask(
            {
            name: newTask.name,
            estimated_effort: 1,
            list_id: getMainListID(),
          });
          setNewTask({ name: "", estimated_effort: 1, list_id: 1, project_id: "0" });
        }
      };
    

  useEffect(() => {
    if ((user?.tasks, tasks)) {
      // Only update tasks if there's a change in user.tasks
      setTasks(getTasksByList(getMainListID()));
      setProjectList(getProjectList());      
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
              <TouchableOpacity style={taskList_styles.addBtnContainer} onPress={handleAddTask} >
                <View style={taskList_styles.addBtn}  >
                    <MaterialIcons name="add-circle" size={24} color="black" />
                </View>
                <Text>Agregar Tarea</Text>
              </TouchableOpacity>
              <View style={taskList_styles.editTaskContainer}>
                <TextInput
                //   style={taskList_styles.input}
                  placeholder="Nueva Tarea"
                  value={newTask.name}/>
                <View style={taskList_styles.editTaskSection}>
                    <Text style={util_styles.h4}>Pomodoros estimados</Text>

                    <TextInput
                    //   style={taskList_styles.input}
                    placeholder="Pomodoros estimados"
                    value={newTask.estimated_effort.toString()}
                    onChangeText={(value) => setNewTask({...newTask, estimated_effort: parseInt(value)})}
                    keyboardType="number-pad"
                    />
                    <View style={{flexDirection: 'row'}}>
                        <TouchableOpacity onPress={() => setNewTask({...newTask, estimated_effort: newTask.estimated_effort - 1})}>
                        <MaterialIcons name="remove-circle" size={24} color="black" />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setNewTask({...newTask, estimated_effort: newTask.estimated_effort + 1})}>
                        <MaterialIcons name="add-circle" size={24} color="black" />
                        </TouchableOpacity>
                    </View>
                </View> 
                <View style={taskList_styles.editTaskSection} >
                    <View>
                        <Text style={util_styles.h4}>Lista</Text>
                            {listItems.map((item, index) => (
                            <TouchableOpacity key={index}>
                                <Text style={util_styles.p}>{item.label}</Text>
                            </TouchableOpacity>
                            ))}
                    </View>
                    <View>
                        <Text style={util_styles.h4}>Proyecto</Text>
                        {projectList.length > 0 && projectList.map((item, index) => (
                            <TouchableOpacity key={index}>
                                <Text>{item.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                    
                </View>
                <View >
                    <TouchableOpacity onPress={handleAddTask} style={[util_styles.btn, util_styles.btn_dark]}>
                        <Text style={[util_styles.t_white]}>Añadir Tarea</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={[util_styles.btn, util_styles.btn_secondary]}>
                        <Text>Cancelar</Text>
                    </TouchableOpacity>
                </View>
            </View>
    </View>
  )

}


export default TaskList
