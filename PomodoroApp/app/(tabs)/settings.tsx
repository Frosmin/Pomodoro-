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
import { MaterialCommunityIcons } from "@expo/vector-icons";
import CustomCheckBox from "@/components/UI/CustomCheckBox";

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

interface timerSettings {
  focus: number;
  shortBreak: number;
  longBreak: number;
  intervals: number;
  [key : string] : any;
}

interface soundsSettings {
  alarm: boolean;
  alarmVolume: number;
  tick: boolean;
  tickVolume: number;
}

interface themeSettings{
  focus: string;
  shortBreak: string;
  longBreak: string;
}

interface advancedPomodoro {
  active: boolean;
  firstReminder: number;
  lastReminder: number;
  remindersVolume: number;
}

interface settings {
  timer: timerSettings;
  sounds: soundsSettings;
  [key : string] : any;
}

export default function settings() {
  
  const {user,state,dispatch} = useGlobalContext();
  const [timeItem,setTimeItems] = useState<timerItem[]>([]);
  const [settings, setSettings] = useState<settings>({
    timer: {
      focus: 25,
      shortBreak: 5,
      longBreak: 15,
      intervals: 4,
    },
    sounds: {
      alarm: true,
      alarmVolume: 0.5,
      tick: true,
      tickVolume: 0.5,
    },
  });
  const [params, setParams] = useState<Params>();


  const handleChangeBooleans = (setting : string,field: string, value: boolean) => {
    setSettings({...settings, [setting]: {...settings[setting], [field]: value}});
  };

  const handleChangeStrings = (setting : string,field: string, value: string) => {
    setSettings({...settings, [setting]: {...settings[setting], [field]: value}});
  };

  const onSubmit = () => {
    if (params === undefined) return;
    dispatch({type: ActionKind.SET_PARAMS, payload: params});
  }

  useEffect(() => {
    setTimeItems([
      {name: "Pomodoro", value: state.params.focusTime, reference: "focus"},
      {name: "Descanso Corto", value: state.params.breakTime, reference: "shortBreak"},
      {name: "Descanso Largo", value: state.params.longBreakTime, reference: "longBreak"},
    ]);
    setParams(state.params);
  },[state])

  return (
    <View style={[util_styles.container, {backgroundColor: colors.secondary}]}>
      <SectionHeader text="Ajustes"/>
        <View style={styles.container}>
          <View style={styles.setting_section}>
            <View style={styles.setting_section_header}>
              <MaterialCommunityIcons name="timer-cog-outline" size={24} color={colors.neutral_200} />
              <Text style={styles.setting_section_header_text}>TIMER</Text>
            </View>
            <View style={styles.setting_item_column}>
              <Text style={util_styles.h4}>Tiempo(minutos)</Text>
              <View style={styles.form}>
                {timeItem.length >0 && params !== undefined && timeItem.map((item, index) => (
                  <View key={index} style={styles.input_item} >
                    <Text style={util_styles.p}>{item.name}</Text>
                    <TextInput style={styles.input} keyboardType="numeric" value={settings.timer[item.reference].toString()} onChange={(e) => handleChangeStrings("timer", item.reference, e.nativeEvent.text)}/> 
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.setting_item_row}>
              <Text style={util_styles.h4}>Intervalo de tiempo largo</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={state.params.intervals.toString()}/>
            </View>
        </View>
        <View style={styles.setting_section}>
          <View style={styles.setting_section_header}>
            <MaterialCommunityIcons name="bullhorn-outline" size={24} color={colors.neutral_200} />
            <Text style={styles.setting_section_header_text}>Sonidos</Text>
          </View>
          <View style={styles.setting_item_row}>
            <Text style={util_styles.h4}>Alarma</Text>
            <CustomCheckBox state={settings.sounds.alarm} onPress={handleChangeBooleans} setting="sounds" field="alarm"/>
          </View>
          <View style={styles.setting_item_row}>
            <Text style={util_styles.h4}>Sonido Tick</Text>
            <CustomCheckBox state={settings.sounds.tick} onPress={handleChangeBooleans} setting="sounds" field="tick"/>
          </View>
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
  setting_section: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  setting_section_header: {
    display: "flex",
    flexDirection: "row",
    gap: 12,
    marginBottom: 16,
  },

  setting_section_header_text: {
    fontSize: 16,
    fontWeight: "bold",
    color: colors.neutral_200,
  },
  setting_item_column: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  setting_item_row: {
    width: "100%",
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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
