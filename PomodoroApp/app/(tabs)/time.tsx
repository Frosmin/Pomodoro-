import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";
import { BarChart } from "react-native-chart-kit";
import { Dimensions } from "react-native";
import { colors } from "@/styles/colors";


export default function time() {
    const {
      user,
      controllers: {
        TaskController: { getTasksByList },
        ListController: { getMainListID },
      },
    } = useGlobalContext();
}