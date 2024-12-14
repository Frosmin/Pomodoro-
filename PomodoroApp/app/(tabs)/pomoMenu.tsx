import { ThemedView } from '@/components/ThemedView'
import LinkList from '@/components/UI/LinkList'
import util_styles from '@/styles/utils'
import { Link, router } from 'expo-router'
import React from 'react'
import { View, Text, StyleSheet } from 'react-native'
export interface itemType {
  name : string,
  icon : "folder" | "clipboard-list" | "cog",
  link : "./projects" | "./activityInventory" | "./settings" | "./SummaryScreen",
  color : string,
}

const pomoMenu = () => {

  const items : itemType[] = [
    {name:"Proyectos",icon:"folder",link:"./projects", color: "red"},
    {name: "Inventario de Actividades", icon:"clipboard-list",link: "./activityInventory", color: "#5fcf60"},
    {name: "Ajustes", icon:"cog",link: "./settings", color: "black"},
    {name: "Pomodoro", icon:"cog",link: "./SummaryScreen", color: "black"},
  ]
  const handlePress = (link : "./projects" | "./activityInventory" ) => {
    router.push({pathname: link});
  }

  return (
    <ThemedView style={styles.container}>
      <Text style={[styles.title]}>Menu</Text>
      <View style={{width:"100%"}}>
        {items.map((item, index) => (
          <LinkList
            key={index}
            item={item}
            onPress={handlePress} 
            
             />
        ))}
      </View>
    </ThemedView>
  )
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fee8c8",
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 50,
    color: "#ef6548",
    marginTop: 20,
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

  button: {
    backgroundColor: "#ef6548",
    padding: 10,
    borderRadius: 5,
    justifyContent: "center",
    marginVertical: 5, //cochinada cambiar despues
  },
  buttonText: {
    color: "white",
  },
});


export default pomoMenu
