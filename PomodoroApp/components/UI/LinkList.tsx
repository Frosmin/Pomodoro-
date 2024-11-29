import { colors } from '@/styles/colors'
import util_styles from '@/styles/utils'
import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import { Text ,TouchableOpacity} from 'react-native'
import { StyleSheet } from 'react-native'
import { itemType } from '@/app/(tabs)/pomoMenu'


const LinkList = ({item, onPress = (params : any) => {}} : {item : itemType, onPress?: (params : any) => void}) => {
  return (
    <TouchableOpacity onPress={() => onPress(item.link)} style={[styles.container]} >
        <MaterialCommunityIcons name={item.icon} size={24} color={item.color} />
        <Text style={[util_styles.h4, util_styles.t_white]}>{item.name}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container : {
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderStyle: 'solid',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    gap: 20,
    borderColor: colors.neutral_200,
    borderBottomWidth: 0.5
  }
})

export default LinkList
