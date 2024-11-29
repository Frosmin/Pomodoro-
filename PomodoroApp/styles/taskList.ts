
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
        width: "100%",
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
        flexDirection: 'row',
        borderRadius:10,      
        padding: 10,
        gap:5,
        overflow: 'hidden',
      },

      editTaskContainerClosed: {
        position: 'relative',
        height:0,
        overflow: 'hidden',
      },

      edit_task_window: {
        position: 'relative',
        // backgroundColor: '#5aaafa',
        width: '100%',
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
        backgroundColor: colors.neutral_100,
        paddingVertical: 5,
      },

      //estimate

      estimate_container: {
        width: '100%',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        backgroundColor: colors.primary_500,
        marginBottom: 10,
        borderRadius: 10,
      },
      number_input: {
        width: 50,
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingHorizontal: 10,
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: colors.neutral_200,
        borderWidth: 0.5,
      },

})

export default taskList_styles