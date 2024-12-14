import React, { useState } from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import taskList_styles from '@/styles/taskList'
import { Task,TaskStatus } from '@/db/models/Task'
import { MaterialCommunityIcons,Ionicons } from '@expo/vector-icons'
import { ActionKind } from '@/context/reducer'
import { useGlobalContext } from '@/context/AppContext'
import TaskEditer from '../TaskEditer'
import { colors } from '@/styles/colors'

const ActivityTask = ({ task,index, isChecked, checkTask}: { task: Task,index : number,isChecked : boolean, checkTask: (index :number) => void }) => {

    const { state,dispatch,controllers:{TaskController:{changeTaskStatus,deleteTask}} } = useGlobalContext();
    const [open,setOpen] = useState<boolean>(false);
    

      if(open){
        return <TaskEditer task={task} open={open} setOpen={setOpen} />
      }else{
        return (
            <View
              key={task._id.toString()}
              style={[
                taskList_styles.taskContainer,
                state.activeTask === task._id.toString() ? taskList_styles.active_task : null,{backgroundColor: colors.white},
              ]}
            >
                <TouchableOpacity onPress={() => checkTask(index)} >
                    <MaterialCommunityIcons
                    name={isChecked ? "checkbox-marked" : "checkbox-blank-outline"}
                    size={24}
                    color="black"
                    />
                </TouchableOpacity>
                <TouchableOpacity  style={taskList_styles.taskInfo}>
                    <Text
                        style={[
                          { width: '68%' },
                          task.status === TaskStatus.FINISHED && { textDecorationLine: 'line-through' },
                        ]}>
                        {task.name}
                    </Text>
                    <Text style={{width: '30%', textAlign: 'right'}}>
                        {task.real_effort} / {task.estimated_effort}
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setOpen(true)} style={{alignSelf:'center'}}>
                    <Ionicons name="pencil" size={16} color="black" />
                </TouchableOpacity>
            </View>

        )
      }
  
}

export default ActivityTask