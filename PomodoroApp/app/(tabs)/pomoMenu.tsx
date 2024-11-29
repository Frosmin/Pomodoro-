import { ThemedView } from '@/components/ThemedView'
import LinkList from '@/components/UI/LinkList'
import util_styles from '@/styles/utils'
import { Link, router } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native'
export interface itemType {
  name : string,
  icon : "folder" | "clipboard-list" | "cog",
  link : "./projects" | "./activityInventory" | "./settings",
  color : string,
}

const pomoMenu = () => {

const items : itemType[] = [
  {name:"Proyectos",icon:"folder",link:"./projects", color: "#ffff00"},
  {name: "Inventario de Actividades", icon:"clipboard-list",link: "./activityInventory", color: "#5fcf60"},
  {name: "Ajustes", icon:"cog",link: "./settings", color: "#fff"},
]
  const handlePress = (link : "./projects" | "./activityInventory" ) => {
    router.push({pathname: link});
  }

  return (
    <ThemedView style={util_styles.container}>
      <Text style={[util_styles.title,util_styles.t_white]}>Menu</Text>
      <View style={{width:"100%"}}>
        {items.map((item, index) => (
          <LinkList key={index} item={item} onPress={handlePress}  />
        ))}
      </View>
    </ThemedView>
  )
}

export default pomoMenu
