import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useGlobalContext } from "@/context/AppContext";
import { BarChart } from "react-native-chart-kit";
import { PieChart } from "react-native-chart-kit";

import { Ionicons } from "@expo/vector-icons";
import { ListTypes } from "@/db/models/List";

export default function monthlyReport() {
  const {
    controllers: {
      TaskController: { getTaskForReports },
      ProjectController: { getProjectList },
    },
  } = useGlobalContext();

  const tasks = getTaskForReports();
  const projects = getProjectList();

  // Filtrar tareas de hoy
  const today = new Date();
  const monthlyTasks = tasks.filter((task) => {
    if (!task.started_at) return false;
    const taskDate = new Date(task.started_at);
    return (
      taskDate.getMonth() === today.getMonth() &&
      taskDate.getFullYear() === today.getFullYear()
    );
  });

  // 2. Luego agrupamos las tareas mensuales por proyecto tambien saca totalEfort y realEffort
  const tasksByProject = Object.values(
    monthlyTasks.reduce((acc, task) => {
      const project = projects.find(p => p._id.toString() === task.project_id.toString());
      const projectName = project?.name || "Sin Proyecto";
      if (!acc[projectName]) {
        acc[projectName] = {
          projectName,
          taskCount: 0,
          totalEstimatedEffort: 0,
          realEffort: 0
        };
      }
      acc[projectName].taskCount++;
      acc[projectName].totalEstimatedEffort += task.estimated_effort;
      acc[projectName].realEffort += task.real_effort;
      return acc;
    }, {} as Record<string, { 
      projectName: string; 
      taskCount: number;
      totalEstimatedEffort: number;
      realEffort: number;
    }>)
  );

 
  const chartHeight = Math.max(200, tasksByProject.length * 50);

  
  const projectChartData = {
    labels: tasksByProject.map((p) => p.projectName),
    datasets: [
      {
        data: tasksByProject.map((p) => p.taskCount),
      },
    ],
  };

  const totalEstimatedEffort = monthlyTasks.reduce(
    (sum, task) => sum + task.estimated_effort,
    0
  );
  
  const totalRealEffort = monthlyTasks.reduce(
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
                  Tiempo de Concentración del Mes
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
                  Pomodoros estimados: {project.totalEstimatedEffort}
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
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
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
    color: "#666",
    marginBottom: 4,
  },
  timeValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#ef6548",
  },
});
