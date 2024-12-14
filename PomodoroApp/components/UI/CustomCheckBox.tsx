import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import util_styles from '@/styles/utils'

const CustomCheckBox = ({state,onPress,  field} : {state : boolean, onPress : ( field : "alarm" | "tick", value : boolean) => void, field : "alarm" | "tick"}) => {
  return (
    <TouchableOpacity style={[util_styles.custom_checkbox, state && util_styles.custom_checkbox_checked]} onPress={() => onPress(field, !state)}>
        <View style={util_styles.custom_checkbox_inside}></View>
    </TouchableOpacity>
  )
}

export default CustomCheckBox
