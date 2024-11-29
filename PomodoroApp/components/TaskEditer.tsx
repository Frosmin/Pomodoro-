import React,{useEffect, useState} from 'react'
import { View, Text, TextInput, TouchableOpacity }  from 'react-native'
import { useGlobalContext } from '@/context/AppContext';
import taskList_styles from '@/styles/taskList';
import util_styles from '@/styles/utils';
import { MaterialIcons } from '@expo/vector-icons';
import { Task,NewTask } from '@/db/models/Task';
import { List } from '@/db/models/List';
import { Project } from '@/db/models/Project';
import Realm from 'realm';


  interface props {
    task? : Task,
    open: boolean,
    setOpen: React.Dispatch<React.SetStateAction<boolean>>,
  }

const TaskEditer = ({...props}: props) => {
    const {task,open,setOpen} = props
    const [listItems, setListItems] = useState<List[]>([]);
    const [projects,setProjects] = useState<Project[]>([])

    const [newTask, setNewTask] = useState<NewTask>({
        name: task ? task.name : "",
        estimated_effort: task ? task.estimated_effort : 1,
        list_id: task ? task.list_id.toString() : "",
        project_id: task ? task.project_id.toString() : "",
    });

    const {
        user,
        controllers: {
          TaskController: { addTask,deleteTask,editTask },
          ListController: { getMainListID,getActiveLists },
          ProjectController: {getProjectList},
        },
      } = useGlobalContext();

    const editNewTask = (field : string, value: string | number) => {
        console.log(field, value);
        
        switch (field) {
            case "name":
                setNewTask({ ...newTask, name: value.toString() });
                break;
            case "estimated_effort":
                setNewTask({ ...newTask, estimated_effort: Number(value) });
                break;
            case "list_id":
                setNewTask({ ...newTask, list_id: value.toString() });
                break;
            case "project_id":
                setNewTask({ ...newTask, project_id: value.toString() });
                break;
            default:
                break;
        }
    }

    const handleAddTask = () => {
      if (newTask.name.trim() !== "") {
        console.log("Añadiendo Tarea");
        addTask(
          {
          name: newTask.name,
          estimated_effort: newTask.estimated_effort,
          list_id: new Realm.BSON.ObjectId(newTask.list_id),
          project_id: new Realm.BSON.ObjectId(newTask.project_id),
        });
        setNewTask({ name: "", estimated_effort: 1, list_id: "", project_id: "0" });
        setOpen(false);
    }
    };

    const handleDeleteTask = () => {
        if(task !== undefined){
            deleteTask(task._id);
            setOpen(false);
        }
        
    }
    

    const handleEditTask = () => {
      if (newTask.name.trim() !== "" && task !== undefined) {
        console.log("Editando Tarea");
        editTask(task._id.toString(), newTask);
        setOpen(false);
      }else{
        console.log("Tarea no editada");
      }
    };
  
    useEffect(() => {
        setProjects(getProjectList());      
        setListItems(getActiveLists());
    },[user])

    useEffect(() => {
        if(task === undefined && projects.length > 0 && listItems.length > 0){
            setNewTask({...newTask,project_id: projects[0]._id.toString(), list_id: listItems[0]._id.toString()})
        }
        
    },[projects,listItems])

  return (
    <View style={[open ? taskList_styles.editTaskContainerOpen : taskList_styles.editTaskContainerClosed]}>
      <View style={taskList_styles.edit_task_window}>
        <TextInput
          //   style={taskList_styles.input}
          placeholder="Nueva Tarea"
          value={newTask.name}
          onChangeText={(value) => setNewTask({...newTask, name: value})}
        />
        <View style={taskList_styles.editTaskSection}>
          <Text style={util_styles.h4}>Pomodoros estimados</Text>
          <View style={[util_styles.flex_row, util_styles.g_2]}>
            <TextInput
              style={taskList_styles.number_input}
              placeholder="Pomodoros estimados"
              value={newTask.estimated_effort.toString()}
              onChangeText={(value) => setNewTask({...newTask, estimated_effort: parseInt(value)})}
              keyboardType="number-pad"
            />
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                onPress={() => setNewTask({...newTask, estimated_effort: newTask.estimated_effort - 1})}
              >
                <MaterialIcons name="remove-circle" size={24} color="black" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setNewTask({...newTask, estimated_effort: newTask.estimated_effort + 1})}
              >
                <MaterialIcons name="add-circle" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View style={taskList_styles.editTaskSection}>
          <View>
            <Text style={[util_styles.h4, util_styles.mb_1]}>Lista</Text>
            {listItems.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => editNewTask("list_id", item._id.toString())}
                style={[
                  taskList_styles.edit_list_item,
                  index === 0 ? { borderTopWidth: 1 } : {},
                  newTask.list_id === item._id.toString() ? taskList_styles.edit_list_item_active : {}
                ]}
              >
                <Text style={util_styles.p}>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
          <View>
            <Text style={[util_styles.h4, util_styles.mb_1]}>Proyecto</Text>
            {projects.length > 0 && projects.map((item, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => editNewTask("project_id", item._id.toString())}
                style={[
                  taskList_styles.edit_list_item,
                  index === 0 ? { borderTopWidth: 1 } : {},
                  (newTask.project_id === "0" && index === 0) || newTask.project_id === item._id.toString() ? taskList_styles.edit_list_item_active : {}
                ]}
              >
                <Text>{item.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        {/* Botones */}

        <View style={[taskList_styles.edit_btn_container]}>
          {task !== undefined && (
              <TouchableOpacity  style={[util_styles.btn]} onPress={handleDeleteTask}>
                  <MaterialIcons name="delete" size={24} color="black" />
              </TouchableOpacity>
          )}
          
          <View style={[util_styles.flex_row, util_styles.g_2]}>    
              <TouchableOpacity style={[util_styles.btn, util_styles.btn_secondary]}>
                  <Text style={[util_styles.p]} onPress={() => setOpen(false)}>Cancelar</Text>
              </TouchableOpacity>
              {task === undefined ? (
                  <TouchableOpacity onPress={handleAddTask} style={[util_styles.btn, util_styles.btn_dark]}>
                      <Text style={[util_styles.t_white, util_styles.p]}>Añadir</Text>
                  </TouchableOpacity>
              ):
                  <TouchableOpacity onPress={handleEditTask} style={[util_styles.btn, util_styles.btn_dark]}>
                      <Text style={[util_styles.t_white, util_styles.p]}>Guardar</Text>
                  </TouchableOpacity>
              }
              
          </View>
        </View>
      </View>
      <View style={taskList_styles.edit_task_window}>
        <Text>Inventariio de Actividades</Text>
        
      </View>
      
    </View>
  )
}

export default TaskEditer
