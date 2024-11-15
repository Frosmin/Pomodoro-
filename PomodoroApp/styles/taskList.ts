
import { StyleSheet } from "react-native"
import { colors } from "./colors"

const taskList_styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fee8c8',
    },
    list: {
        flex: 1,
        width: '100%',
    },
    taskContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        marginBottom: 5,
        backgroundColor: '#ef6548', //color tareas
        borderRadius: 5,
      },
      taskCon: {
        width: "70%",
        paddingTop: 20,
      },
      taskInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: "70%",
        paddingVertical: 10,
      },
      active_task:{
        backgroundColor: "#c53f27",
      },
      addBtnContainer: {
        backgroundColor: "#ef6538",
        display: "flex",
        flexDirection: "row",
        gap: 10,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderStyle: "dashed",
        borderColor:"#c53f27",
        borderWidth: 2,
      },
      addBtn: {
        backgroundColor: "transparent"
      },

    //   Para editar / agregar tareas
    editTaskContainerOpen: {
        position: 'relative',
        width: '100%',
        backgroundColor: '#fff',
        flexDirection: 'column',
        borderRadius:10,      
        padding: 10,
        gap:5,
      },

      editTaskContainerClosed: {
        position: 'relative',
        height:0,
        overflow: 'hidden',
      },

      editTaskSection: {
        flexDirection: 'column',
        gap: 5,
      },
      edit_list : {

      },
      edit_list_item: {
        borderColor: colors.neutral_100,
        borderBottomWidth: 0.5,
        paddingVertical: 5,
        paddingHorizontal: 10,
      },
      edit_list_item_active: {
        backgroundColor: colors.neutral_100,
      },
      edit_btn_container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
      },

})

export default taskList_styles