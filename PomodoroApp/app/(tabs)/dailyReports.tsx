// import React from "react";
// import { View, Text, StyleSheet, ScrollView } from "react-native";
// import { useGlobalContext } from "@/context/AppContext";
// import { BarChart } from "react-native-chart-kit";

// export default function dailyReports() {
//   const {
//     controllers: {
//       TaskController: { getTasksByList },
//       ListController: { getMainListID },
//     },
//   } = useGlobalContext();

//   const tasks = getTasksByList(getMainListID());

//   const today = new Date();
//   const dailyTasks = tasks.filter((task) => {
//     if (!task.started_at) return false;
//     const taskDate = new Date(task.started_at);
//     return (
//       taskDate.getDate() === today.getDate() &&
//       taskDate.getMonth() === today.getMonth() &&
//       taskDate.getFullYear() === today.getFullYear()
//     );
//   });

//   const completedDailyTasks = dailyTasks.filter(
//     (task) => task.status === "FINISHED"
//   ).length;

//   const totalDailyTasks = dailyTasks.length;

//   const completionRate =
//     totalDailyTasks > 0 ? (completedDailyTasks / totalDailyTasks) * 100 : 0;

//     const chartData = {
//       labels: ["Estimado", "Real"],
//       datasets: [
//         {
//           data: [
//             dailyTasks.reduce((sum, task) => sum + task.estimated_effort, 0), // Suma de estimated_effort
//             dailyTasks.reduce((sum, task) => sum + task.real_effort, 0),      // Suma de real_effort
//           ],
//         },
//       ],
//     };

//   const totalEstimatedEffort = dailyTasks.reduce(
//     (sum, task) => sum + task.estimated_effort,
//     0
//   );
//   const totalRealEffort = dailyTasks.reduce(
//     (sum, task) => sum + task.real_effort,
//     0
//   );

//   return (
//     <ScrollView style={styles.container}>
//       <Text style={styles.title}>Reporte Diario</Text>
//       <View style={styles.statsContainer}>
//         <Text style={styles.statsText}>
//           Tareas Completadas: {completedDailyTasks}/{totalDailyTasks}
//         </Text>
//         <Text style={styles.statsText}>
//           Tasa de Finalización: {completionRate.toFixed(2)}%
//         </Text>

//         <Text style={styles.statsText}>
//           Pomodoros Estimados Total: {totalEstimatedEffort}
//         </Text>
//       </View>

//       <View style={styles.chartContainer}>
//         <Text style={styles.subtitle}>Esfuerzo Estimado vs Real</Text>
//         <BarChart
//           data={chartData}
//           width={300}
//           height={200}
//           chartConfig={{
//             backgroundColor: "#ffffff",
//             backgroundGradientFrom: "#ffffff",
//             backgroundGradientTo: "#ffffff",
//             color: (opacity = 1) => `rgba(239, 101, 72, ${opacity})`,
//           }}
//           yAxisLabel="pomodoros2"
//           yAxisSuffix=" pomodoros"
//         />
//       </View>

//       <View style={styles.taskList}>
//         <Text style={styles.subtitle}>Detalle de Tareas</Text>
//         {dailyTasks.map((task) => (
//           <View key={task._id.toString()} style={styles.taskItem}>
//             <Text>Tarea: {task.name}</Text>
//             <Text>Estado: {task.status}</Text>
//             <Text>Pomodoros Estimados: {task.estimated_effort}</Text>
//             <Text>Pomodoros Realizados: {task.real_effort}</Text>
//           </View>
//         ))}
//       </View>
//     </ScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "#fee8c8",
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//     marginBottom: 20,
//     color: "#ef6548",
//   },
//   subtitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//     marginVertical: 10,
//     color: "#c53f27",
//   },
//   statsContainer: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//   },
//   statsText: {
//     fontSize: 16,
//     marginBottom: 5,
//   },
//   chartContainer: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 20,
//     alignItems: "center",
//   },
//   taskList: {
//     backgroundColor: "#fff",
//     padding: 15,
//     borderRadius: 10,
//   },
//   taskItem: {
//     borderBottomWidth: 1,
//     borderBottomColor: "#eee",
//     paddingVertical: 10,
//   },
// });

import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useGlobalContext } from "@/context/AppContext";
import { BarChart } from "react-native-chart-kit";
import { PieChart } from "react-native-chart-kit";
import { Ionicons } from "@expo/vector-icons";

export default function dailyReports() {
  const {
    controllers: {
      TaskController: { getTaskForReports},
      ProjectController: { getProjectList },
    },
  } = useGlobalContext();

  const tasks = getTaskForReports();
  const projects = getProjectList();

  // Filtrar tareas de hoy
  const today = new Date();
  const dailyTasks = tasks.filter((task) => {
    if (!task.started_at) return false;
    const taskDate = new Date(task.started_at);
    return (
      taskDate.getDate() === today.getDate() &&
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  /// Filtrar y agrupar solo los proyectos que tienen tareas hoy
  const tasksByProject = projects
    .map((project) => {
      const projectTasks = dailyTasks.filter(
        (task) => task.project_id.toString() === project._id.toString()
      );
      return {
        projectName: project.name,
        taskCount: projectTasks.length,
        
        estimatedEffort: projectTasks.reduce(
          (sum, task) => sum + task.estimated_effort,
          0
        ),
        realEffort: projectTasks.reduce(
          (sum, task) => sum + task.real_effort,
          0
        ),
      };
    })
    .filter((project) => project.taskCount > 0); // Solo proyectos con tareas

  const chartHeight = Math.max(200, tasksByProject.length * 50);

  // Datos para la gráfica de proyectos
  const projectChartData = {
    labels: tasksByProject.map((p) => p.projectName),
    datasets: [
      {
        data: tasksByProject.map((p) => p.taskCount),
      },
    ],
  };

  const totalEstimatedEffort = dailyTasks.reduce(
    (sum, task) => sum + task.estimated_effort,
    0
  );
  const totalRealEffort = dailyTasks.reduce(
    (sum, task) => sum + task.real_effort,
    0
  );

  const chartColors = [
    "#FF6B6B", // rojo
    "#4ECDC4", // turquesa
    "#45B7D1", // azul claro
    "#96CEB4", // verde menta
    "#FFEEAD", // amarillo claro
    "#D4A5A5", // rosa pálido
    "#9EA1D4", // violeta
    "#A8E6CF", // verde claro
  ];

  const pieChartData = tasksByProject.map((project, index) => ({
    name: project.projectName,
    population: project.taskCount,
    color: chartColors[index % chartColors.length],
    legendFontColor: "#7F7F7F",
    legendFontSize: 12,
  }));

  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return { hours, mins };
  };

  const timeStats = formatTime(totalRealEffort * 25);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte Diario por Proyecto</Text>

      {tasksByProject.length > 0 ? (
        <>
          <View style={styles.chartContainer}>
            <Text style={styles.subtitle}>Tareas por Proyecto</Text>
            {/* <BarChart
              data={projectChartData}
              width={300}
              height={chartHeight}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: (opacity = 1) => `rgba(239, 101, 72, ${opacity})`,
                barPercentage: 0.5,
              }}
              yAxisLabel=""
              yAxisSuffix=" tareas"
              verticalLabelRotation={30}
            /> */}
            <PieChart
              data={pieChartData}
              width={300}
              height={200}
              chartConfig={{
                backgroundColor: "#ffffff",
                backgroundGradientFrom: "#ffffff",
                backgroundGradientTo: "#ffffff",
                color: (opacity = 1) => `rgba(239, 101, 72, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
              }}
              accessor="population"
              backgroundColor="transparent"
              paddingLeft="15"
              absolute // Mostrar números absolutos en lugar de porcentajes
            />
            <View style={styles.timeCard}>
              <Ionicons name="time-outline" size={24} color="#ef6548" />
              <View style={styles.timeInfo}>
                <Text style={styles.timeTitle}>
                  Tiempo de Concentración Hoy
                </Text>
                <Text style={styles.timeValue}>
                  {timeStats.hours > 0 && `${timeStats.hours}h `}
                  {timeStats.mins}min
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.taskList}>
            <Text style={styles.subtitle}>Detalle por Proyecto</Text>
            {tasksByProject.map((project, index) => (
              <View key={index} style={styles.projectItem}>
                <Text style={styles.projectName}>{project.projectName}</Text>
                <Text style={styles.statsText}>
                  Número de tareas: {project.taskCount}
                </Text>
                <Text style={styles.statsText}>
                  Pomodoros estimados: {project.estimatedEffort}
                </Text>
                <Text style={styles.statsText}>
                  Pomodoros realizados: {project.realEffort}
                </Text>
              </View>
            ))}
          </View>
        </>
      ) : (
        <View style={styles.noDataContainer}>
          <Text style={styles.noDataText}>
            No hay tareas registradas para hoy
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  // ... estilos existentes ...
  projectItem: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  projectName: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#ef6548",
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fee8c8",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#ef6548",
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#c53f27",
  },
  statsContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statsText: {
    fontSize: 16,
    marginBottom: 5,
  },
  chartContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  taskList: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
  },
  taskItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingVertical: 10,
  },
  noDataContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
    marginTop: 20,
    borderRadius: 10,
    minHeight: 200,
  },
  noDataText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    fontWeight: "500",
  },
  timeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  timeInfo: {
    marginLeft: 15,
  },
  timeTitle: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ef6548',
  },
});
