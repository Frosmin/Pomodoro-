
import { StyleSheet } from "react-native"

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
        paddingVertical: 10,
        paddingHorizontal: 20,
        marginBottom: 5,
        backgroundColor: '#ef6548', //color tareas
        borderRadius: 5,
      },
      taskCon: {
        // height: 200, // Ajusta esta altura según lo necesario
        width: "60%",
        //backgroundColor: "white",
        paddingTop: 20,
      },
    //   list: {
    //     flexGrow: 0,
    //   },
      taskScroll: {
        height: 200, // Limitar el tamaño del área de scroll
      },
      active_task:{
        backgroundColor: "#c53f27",
      },
      addBtnContainer: {
        backgroundColor: "#ef6538",
        display: "flex",
        flexDirection: "row",
        gap: 75,
        justifyContent: "center",
        alignItems: "center",
        padding: 10,
        borderStyle: "dashed",
        borderColor:"#fff",
        borderWidth: 1,
      },
      addBtn: {
        backgroundColor: "transparent"
      }
})

export default taskList_styles