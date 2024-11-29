import { ThemedView } from '@/components/ThemedView'
import LinkList from '@/components/UI/LinkList'
import util_styles from '@/styles/utils'
import { Link, router } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native'
export interface itemType {
  name : string,
  icon : "folder" | "clipboard-list",
  link : "./projects" | "./activityInventory"
}

const pomoMenu = () => {

const items : itemType[] = [{name:"Proyectos",icon:"folder",link:"./projects"},{name: "Inventario de Actividades", icon:"clipboard-list",link: "./activityInventory"}]
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
