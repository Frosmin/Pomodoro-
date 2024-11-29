import { colors } from '@/styles/colors'
import util_styles from '@/styles/utils'
import React from 'react'
import { Text ,TouchableOpacity} from 'react-native'
import { StyleSheet } from 'react-native'

const LinkList = ({text = "", onPress = (params : any) => {}, arg = ""} : {text?: string, onPress?: (params : any) => void, arg? :string}) => {
  return (
    <TouchableOpacity onPress={() => onPress(arg)} style={[styles.container]} >
        <Text style={[util_styles.h4, util_styles.t_white]}>{text}</Text>
    </TouchableOpacity>
  )
}


const styles = StyleSheet.create({
  container : {
    paddingHorizontal: 10,
    paddingVertical: 16,
    borderStyle: 'solid',
    width: '100%',
  }
})

export default LinkList
