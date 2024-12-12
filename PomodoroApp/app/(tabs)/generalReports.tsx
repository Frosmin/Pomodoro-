import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { colors } from "@/styles/colors";
import { ListTypes } from "@/db/models/List";

export default function generalReports() {
  const {
    user,
    controllers: {
      TaskController: { getTasksByList },
      ListController: { getListIdByType },
    },
  } = useGlobalContext();

  const tasks = getTasksByList(getListIdByType(ListTypes.RECORD));

  const completedTasks = tasks.filter(
    (task) => task.status === "FINISHED"
  ).length;
  const totalTasks = tasks.length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    const chartData = {
      labels: ["Estimado", "Real"],
      datasets: [
        {
          data: [
            tasks.reduce((sum, task) => sum + task.estimated_effort, 0),
            tasks.reduce((sum, task) => sum + task.real_effort, 0),
          ],
          colors: [
            //no funciona arreglar
            (opacity = 1) => '#ef6548', // Color rojo para Estimado   
            (opacity = 1) => '#4CAF50'  // Color verde para Real
          ]
        }
      ]
    };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Reporte de Progreso</Text>

      <View style={styles.statsContainer}>
        <Text style={styles.statsText}>
          Tareas Completadas: {completedTasks}/{totalTasks}
        </Text>
        <Text style={styles.statsText}>
          Tasa de Finalización: {completionRate.toFixed(2)}%
        </Text>
        <Text style={styles.statsText}>
          Pomodoros completados:{" "}
          {tasks.reduce((sum, task) => sum + task.real_effort, 0)}
        </Text>
        <Text style={styles.statsText}>
          Tiempo de consentración:{" "}
          {tasks.reduce((sum, task) => sum + task.real_effort, 0) * 25} minutos
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.subtitle}>Esfuerzo Estimado vs Real</Text>
        <BarChart
          data={chartData}
          width={350}
          height={200}
          yAxisLabel="" // Agregado
          yAxisSuffix="" // Agregado
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `red`,

            barPercentage: 2, //grosro de las barras
            decimalPlaces: 0,
            propsForVerticalLabels: {
              fontSize: 15,
            },
            propsForHorizontalLabels: {
              fontSize: 15,
            },
          }}
          showValuesOnTopOfBars={true}
          fromZero={true}
          withInnerLines={true}
          segments={4}
        />
      </View>

      <View style={styles.taskList}>
        <Text style={styles.subtitle}>Detalle de Tareas</Text>
        {tasks.map((task) => (
          <View key={task._id.toString()} style={styles.taskItem}>
            <Text>Tarea: {task.name}</Text>
            {/* <Text>Estado: {task.status}</Text> */}
            <Text>Pomodoros Estimados: {task.estimated_effort}</Text>
            <Text>Pomodoros Realizados: {task.real_effort}</Text>
            <Text>
              Fecha de inicio:{" "}
              {task.started_at
                ? new Date(task.started_at).toLocaleDateString("es-ES", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Sin fecha"}
            </Text>
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
