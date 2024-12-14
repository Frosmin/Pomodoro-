import React, { useEffect } from "react";
import { View, Text, StyleSheet, ScrollView,Dimensions } from "react-native";
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
      PomodoroController: { getLastSevenDaysPomodoros },
    },
  } = useGlobalContext();

  const pomodoros = Object.values(getLastSevenDaysPomodoros().data).reverse();
  const today = new Date();
  const labels = Array.from({ length: 7 }).map((_, i) => {
    const date = new Date(today.getTime() - 1000 * 60 * 60 * 24 * i);
    const days = [
      "dom",
      "lun",
      "mar",
      "mie",
      "jue",
      "vie",
      "sab",
    ];
    return `${days[date.getDay()]}`;
  }).reverse();

  const timerStats = Object.values(getLastSevenDaysPomodoros().data).reduce((acc, pomodoro) => acc + pomodoro, 0);
  

  return (
    <ScrollView style={styles.container}>
      <Text style={[styles.title,{marginTop:20}]}>Reporte Semanal</Text>

      {Object.values(pomodoros).length > 0 ? (
        <>
          <View style={styles.chartContainer}>
            <Text style={styles.subtitle}>Minutos de Concentración</Text>
            <BarChart
                data={{
                    labels: labels,
                    datasets: [
                        {
                            data: pomodoros,
                        },
                    ],
                }}
                width={Dimensions.get('window').width - 20 } // Ancho del gráfico
                height={300} // Alto del gráfico
                
                
                yAxisLabel=""
                yAxisSuffix="m"
                chartConfig={{
                    backgroundColor: '#f2f2f2',
                    barPercentage: 0.7,
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#f2f2f2',
                    decimalPlaces: 0, // Mostrar valores enteros
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                fromZero={true}
                verticalLabelRotation={90} // Rotar etiquetas si son largas
            />
            <View style={styles.timeCard}>
              
              <View style={styles.timeInfo}>
                <Text style={styles.timeTitle}>
                  Tiempo de Concentración de los ultimos 7 dias
                </Text>
                <Text style={styles.timeValue}>
                  {timerStats} minutos
                </Text>
              </View>
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
    padding: 10,
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
    // padding: 15,
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
    marginVertical: 20,
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
