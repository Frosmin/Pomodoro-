import { View, Text, StyleSheet,TextInput,TouchableOpacity,FlatList, } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useState } from "react";
import { router } from "expo-router";

export default function TaskDetails() {
    const { Taskname } = useLocalSearchParams<{ Taskname: string }>();
  
  return (
   <View>
    <Text>Task Details</Text>
    <Text>{Taskname}</Text>
   </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fee8c8',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  projectName: {
    fontSize: 18,
    marginBottom: 10,
  },

  inputContainer: {
    flexDirection: "row",
    marginBottom: 20,
    marginTop: 25,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginRight: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: "#007AFF",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
  },
  projectItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },

  
});