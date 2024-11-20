import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useGlobalContext } from "@/context/AppContext";
import { BarChart } from "react-native-chart-kit";

export default function dailyReports() {
  const {
    user,
    controllers: {
      TaskController: { getTasksByList },
      ListController: { getMainListID },
    },
  } = useGlobalContext();

  const tasks = getTasksByList(getMainListID());

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

  const completedDailyTasks = dailyTasks.filter(
    (task) => task.status === "FINISHED"
  ).length;

  const totalDailyTasks = dailyTasks.length;

  const completionRate =
    totalDailyTasks > 0 ? (completedDailyTasks / totalDailyTasks) * 100 : 0;

  const chartData = {
    labels: ["Estimado", "Real"],
    datasets: [
      {
        data: [
          tasks.reduce((sum, task) => sum + task.estimated_effort, 0),
          tasks.reduce((sum, task) => sum + task.real_effort, 0),
        ],
      },
    ],
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte Diario</Text>
      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Tareas Completadas: {completedDailyTasks}/{totalDailyTasks}
        </Text>
        <Text style={styles.statsText}>
          Tasa de Finalización: {completionRate.toFixed(2)}%
        </Text>
      </View>


      {/* <View style={styles.chartContainer}>
    <Text style={styles.subtitle}>Esfuerzo Estimado vs Real</Text>
    <BarChart
      data={chartData}
      width={300}
      height={200}
      chartConfig={{
        backgroundColor: "#ffffff",
        backgroundGradientFrom: "#ffffff",
        backgroundGradientTo: "#ffffff",
        color: (opacity = 1) => `rgba(239, 101, 72, ${opacity})`,
      }}
      yAxisLabel=""
      yAxisSuffix=" pomodoros"
    />
  </View> */}


      <View style={styles.taskList}>
        <Text style={styles.subtitle}>Detalle de Tareas</Text>
        {dailyTasks.map((task) => (
          <View key={task._id.toString()} style={styles.taskItem}>
            <Text>Tarea: {task.name}</Text>
            <Text>Estado: {task.status}</Text>
            <Text>Pomodoros Estimados: {task.estimated_effort}</Text>
            <Text>Pomodoros Realizados: {task.real_effort}</Text>
          </View>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
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
});
