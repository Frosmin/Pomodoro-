import React, {useState, useEffect} from 'react'
import {StyleSheet, View, Text, ScrollView, TouchableOpacity, TextInput} from 'react-native'
import {MaterialCommunityIcons, MaterialIcons} from '@expo/vector-icons'
import {useGlobalContext} from "@/context/AppContext";
import {Task,TaskStatus} from "@/db/models/Task";
import taskList_styles from "@/styles/taskList";
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActionKind } from '@/context/reducer';
import { getPomodoroDuration } from '@/utils/pomodoroCalculations';


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
          TaskController: { getTasksByList, deleteTask, addTask,changeTaskStatus },
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
    
      const handleDeleteTask = (taskId: Realm.BSON.ObjectID) => {
        console.log(taskId.toString(), "Eliminando Tarea");
        deleteTask(taskId);
      };

  const handleToggleTaskCompletion = (taskId: Realm.BSON.ObjectID) => {
    changeTaskStatus(taskId.toString());
  };
  const selectActiveTask = (task_id: Realm.BSON.ObjectID) => {
    
    dispatch({ type: ActionKind.SET_CURRENT, payload: task_id.toString() });
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
                <View key={task._id.toString()} style={[taskList_styles.taskContainer,state.activeTask === task._id.toString() ? taskList_styles.active_task : null]} onStartShouldSetResponder={(event) => {selectActiveTask(task._id);return true;}}>
                  <TouchableOpacity onPress={() => handleToggleTaskCompletion(task._id)}>
                    <MaterialCommunityIcons name={task.status=== TaskStatus.FINISHED ? "checkbox-marked-circle-outline" : "checkbox-blank-circle-outline"}  size={24} color="black" />
                  </TouchableOpacity>
                
                  <Text style={task.status=== TaskStatus.FINISHED ? { textDecorationLine: 'line-through' } : {}}>{task.name}</Text>
                  <View style={{display:"flex", flexDirection:"row", justifyContent:"space-between", alignItems:"center", gap: 10 }}>
                    <Text>
                        {task.real_effort} / {task.estimated_effort}
                      </Text>
                    <TouchableOpacity onPress={() => handleDeleteTask(task._id)}>
                      <Ionicons name="trash" size={16} color="black" />
                    </TouchableOpacity>
                    </View>      
                </View>
              ))}
              <View style={taskList_styles.addBtnContainer}>
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
