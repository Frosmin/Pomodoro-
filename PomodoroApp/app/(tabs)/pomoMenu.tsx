import { ThemedView } from '@/components/ThemedView'
import LinkList from '@/components/UI/LinkList'
import util_styles from '@/styles/utils'
import { Link, router } from 'expo-router'
import React from 'react'
import { View, Text } from 'react-native'
interface itemType {
  name : string,
  link : "./projects" | "./activityInventory"
}

const pomoMenu = () => {

const items : itemType[] = [{name:"Proyectos",link:"./projects"},{name: "Inventario de Actividades", link: "./activityInventory"}]
  const handlePress = (link : "./projects" | "./activityInventory" ) => {
    router.push({pathname: link});
  }

  return (
    <ThemedView style={util_styles.container}>
      <Text style={[util_styles.title,util_styles.t_white]}>Menu</Text>
      <View>
        {items.map((item, index) => (
          <LinkList key={index} text={item.name} onPress={handlePress} arg={item.link} />
        ))}
      </View>
    </ThemedView>
  )
}

export default pomoMenu
