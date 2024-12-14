

import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useGlobalContext } from "@/context/AppContext";
import { PieChart } from "react-native-chart-kit";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import util_styles from "@/styles/utils";
import { TaskStatus } from "@/db/models/Task";
import { colors } from "@/styles/colors";

export default function dailyReports() {
  const {
    controllers: {
      PomodoroController: {getDailyPomodoros},
    },
  } = useGlobalContext();

  const [date, setDate] = React.useState(new Date());


  const tasks = getDailyPomodoros(date).data;

  

  /// Filtrar y agrupar solo los proyectos que tienen tareas hoy
  const tasksByProject: { projectName: string; taskCount: number }[] = [{projectName: "Sin Proyecto", taskCount: 0}];
   // Solo proyectos con tareas


  tasks.forEach((task) => {
    const projectIndex = tasksByProject.findIndex(
      (p) => p.projectName === task.project
    )
    if (projectIndex !== -1) {
      tasksByProject[projectIndex].taskCount += 1;
    }else{
      tasksByProject.push({ projectName: task.project, taskCount: 1 });
    }
  });
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


  const totalRealEffort = tasks.reduce((total, task) => total + task.minutes, 0);

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

  const timeStats = formatTime(totalRealEffort);



  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title, {marginTop: 20}]}>Reporte Diario</Text>

      <View style={styles.dateContainer}>
        <View style={styles.dateBtnContainer}>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() - 1)))}>
            <MaterialCommunityIcons  name="arrow-left-bold" size={24} color={colors.primary_300} />
          </TouchableOpacity>
          <View style={[styles.dateBtn,{borderLeftWidth: 3, borderColor: colors.primary_300,borderRightWidth: 3}]}>
           <Text style={styles.dateText}>{date.toLocaleDateString('es-ES', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</Text>
          </View>
          <TouchableOpacity style={styles.dateBtn} onPress={() => setDate((prevDate) => new Date(prevDate.setDate(prevDate.getDate() + 1)))}>
            <MaterialCommunityIcons name="arrow-right-bold" size={24} color={colors.primary_300} />
          </TouchableOpacity>
        </View>
      </View>
      {tasksByProject.length > 0 ? (
        <>
          <View style={styles.chartContainer}>
            <Text style={styles.subtitle}>Tareas por Proyecto</Text>
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
            <Text style={styles.subtitle}>Reporte de Tareas</Text>
            <View style={styles.taskListContainer}>
              {tasks.map((task, index) => {
                const {project,minutes,di,de,status,estimated_effort,real_effort} = task
                return (
                  <View key={index} style={styles.projectItem}>
                    <Text style={styles.projectName}>{task.name}</Text>
                    <View style={styles.statsContainer}>
                      <Text style={util_styles.bold}>
                        Proyecto:
                      </Text>
                      <Text style={util_styles.p}>{project}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <Text style={util_styles.bold}>
                        Minutos:
                      </Text>
                      <Text style={util_styles.p}>{minutes}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <Text style={util_styles.bold}>
                        Pomodoros Estimados:
                      </Text>
                      <Text style={util_styles.p}>{estimated_effort}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <Text style={util_styles.bold}>
                        Pomodoros Realizados:
                      </Text>
                      <Text style={util_styles.p}>{real_effort}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <Text style={util_styles.bold}>
                        Distracciones Internas
                      </Text>
                      <Text style={util_styles.p}>{di}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <Text style={util_styles.bold}>
                        Distracciones Externas
                      </Text>
                      <Text style={util_styles.p}>{de}</Text>
                    </View>
                    <View style={styles.statsContainer}>
                      <Text style={util_styles.bold}>
                        Estado:
                      </Text>
                      <Text style={util_styles.p}>{status === TaskStatus.FINISHED ? "Terminada": "En Progreso"}</Text>
                    </View>
                  </View>
                )
              })}
            </View>
            
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
    borderColor: colors.neutral_200,
    borderBottomWidth: 0.5,
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
  taskListContainer: {
    display: "flex",
    flexDirection: "column",
  },
  statsContainer: {
    display : "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  chartContainer: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    alignItems: "center",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent:"center",
    marginBottom: 10
  },
  dateBtnContainer: {
    flexDirection: "row",
    borderColor: colors.primary_300,
    borderWidth: 2,
    borderRadius: 10,
    width: "auto",
    
  },
  dateBtn: {
    paddingVertical: 10,
    paddingHorizontal: 6,
  },
  dateText: {
    color: colors.primary_300,
    fontSize: 16,
    fontWeight: "bold",
  },
  taskList: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 50,
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
