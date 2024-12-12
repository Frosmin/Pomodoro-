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
import Setting from "@/db/models/Setting";

// type AppRoutes = "/(tabs)/dailyReports" | "/(tabs)/generalReports" | "/(tabs)/monthlyReports";

enum AppRoutes {
  thems = "/(tabs)/thems",
  time = "/(tabs)/time",
  // MonthlyReports = "/(tabs)/monthlyReports",
}

interface timerItem {
  name: string;
  value: number;
  reference: "focus" | "shortBreak" | "longBreak";
}


export default function settings() {
  
  const {user,state,dispatch,controllers:{SettingController: {updateSettings}}} = useGlobalContext();
  const [timeItem,setTimeItems] = useState<timerItem[]>([]);
  const [settings, setSettings] = useState<Setting|undefined>(user?.settings);
  const [params, setParams] = useState<Params>();


  const handleChangeBooleans = (field: "alarm" | "tick", value: boolean) => {
    if(settings === undefined) return;
    const newSettings = Object.assign({}, settings);
    newSettings[field] = value;
    setSettings(newSettings);  };

  const handleChangeStrings = (field: "focus" | "shortBreak" | "longBreak" |"intervals", value: string) => {
    if(settings === undefined || /[\D]+/g.test(value)) return;
    const newSettings = Object.assign({}, settings);
    console.log(value);
    

    if(field !== "intervals"){
      newSettings[field] = Number(value) * 60;
    }else{
      newSettings[field] = Number(value);
    }

    setSettings(newSettings);
  };

  const onSubmit = () => {
    if(settings === undefined) return;
    const {focus,shortBreak,longBreak,intervals} = settings;
    const newSettings = Setting.generate() as Setting;
    newSettings.focus = focus ;
    newSettings.shortBreak = shortBreak ;
    newSettings.longBreak = longBreak ;
    updateSettings(newSettings);
    dispatch({type: ActionKind.SET_PARAMS, payload:  {
      focusTime: focus,
      breakTime : shortBreak,
      longBreakTime: longBreak,
      intervals}});
  }
  

  useEffect(() => {
    setTimeItems([
      {name: "Pomodoro", value: state.params.focusTime, reference: "focus"},
      {name: "Descanso Corto", value: state.params.breakTime, reference: "shortBreak"},
      {name: "Descanso Largo", value: state.params.longBreakTime, reference: "longBreak"},
    ]);
    setParams(state.params);
  },[state])

  if(settings === undefined) return null;
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
                    <TextInput style={styles.input} keyboardType="numeric" value={(settings[item.reference] / 60).toString()} onChange={(e) => handleChangeStrings( item.reference, e.nativeEvent.text)}/> 
                  </View>
                ))}
              </View>
            </View>
            
            <View style={styles.setting_item_row}>
              <Text style={util_styles.h4}>Intervalo de descanso largo</Text>
              <TextInput style={styles.input} keyboardType="numeric" value={settings.intervals.toString()} onChange={(e) => handleChangeStrings( "intervals", e.nativeEvent.text)}/>
            </View>
        </View>
        <View style={styles.setting_section}>
          <View style={styles.setting_section_header}>
            <MaterialCommunityIcons name="bullhorn-outline" size={24} color={colors.neutral_200} />
            <Text style={styles.setting_section_header_text}>Sonidos</Text>
          </View>
          <View style={styles.setting_item_row}>
            <Text style={util_styles.h4}>Alarma</Text>
            <CustomCheckBox state={settings.alarm} onPress={handleChangeBooleans}  field="alarm"/>
          </View>
          <View style={styles.setting_item_row}>
            <Text style={util_styles.h4}>Sonido Tick</Text>
            <CustomCheckBox state={settings.tick} onPress={handleChangeBooleans}  field="tick"/>
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
