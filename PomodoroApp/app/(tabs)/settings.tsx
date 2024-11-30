import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  NativeSyntheticEvent,
  TextInputChangeEventData,
} from "react-native";
import { useGlobalContext } from "@/context/AppContext";
import { Task } from "@/db/models/Task";
import { BarChart } from "react-native-chart-kit";
import { router } from "expo-router";
import util_styles from "@/styles/utils";
import { colors } from "@/styles/colors";
import SectionHeader from "@/components/UI/SectionHeader";
import { ActionKind, Params } from "@/context/reducer";

// type AppRoutes = "/(tabs)/dailyReports" | "/(tabs)/generalReports" | "/(tabs)/monthlyReports";

enum AppRoutes {
  thems = "/(tabs)/thems",
  time = "/(tabs)/time",
  // MonthlyReports = "/(tabs)/monthlyReports",
}

interface timerItem {
  name: string;
  value: number;
  reference: string;
}

export default function settings() {
  
  const {user,state,dispatch} = useGlobalContext();
  const [timeItem,setTimeItems] = useState<timerItem[]>([]);
  const [params, setParams] = useState<Params>();


  const handleChange = (e: NativeSyntheticEvent<TextInputChangeEventData>, item: timerItem) => {
    if (params === undefined) return;
    setParams({ ...params, [item.reference]: Number(e.nativeEvent.text) });
    setTimeItems(timeItem.map((i) => (i.name === item.name ? { ...i, value: Number(e.nativeEvent.text) } : i)));
  };

  const onSubmit = () => {
    if (params === undefined) return;
    dispatch({type: ActionKind.SET_PARAMS, payload: params});
  }

  useEffect(() => {
    setTimeItems([
      {name: "Pomodoro", value: state.params.focusTime, reference: "focusTime"},
      {name: "Descanso Corto", value: state.params.breakTime, reference: "breakTime"},
      {name: "Descanso Largo", value: state.params.longBreakTime, reference: "longBreakTime"},
    ]);
    setParams(state.params);
  },[state])

  return (
    <View style={[util_styles.container, {backgroundColor: colors.secondary}]}>
      <SectionHeader text="Ajustes"/>
      <View style={styles.container}>
        <Text style={util_styles.h4}>Tiempo(minutos)</Text>
        <View style={styles.form}>
          {timeItem.length >0 && params !== undefined && timeItem.map((item, index) => (
            <View key={index} style={styles.input_item} >
              <Text>{item.name}</Text>
               <TextInput style={styles.input} keyboardType="numeric" value={item.value.toString()} onChange={(e) => handleChange(e,item)}/> 
            </View>
          ))}
        </View>
        <TouchableOpacity style={[util_styles.btn, util_styles.btn_primary]} onPress={onSubmit}>
          <Text style={util_styles.btn_text}>Aceptar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    gap: 30,
    marginTop: 30,
    alignItems: "flex-start",
  },
  form: {
    display: "flex",
    flexDirection: "row",
    gap: 10,
  },
  input_item: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
    alignItems: "center",
  },
  input: {
    backgroundColor: colors.white,
    borderRadius: 5,
    borderWidth: 0.5,
    borderColor: colors.neutral_200,
    paddingVertical: 4,
    paddingHorizontal: 16,
    textAlign: "center",
  },

});
