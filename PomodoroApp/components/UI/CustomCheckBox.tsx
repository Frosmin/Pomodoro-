import React from 'react'
import { View, TouchableOpacity } from 'react-native'
import util_styles from '@/styles/utils'

const CustomCheckBox = ({state,onPress, setting, field} : {state : boolean, onPress : (setting : string, field : string, value : boolean) => void, setting : string, field : string}) => {
  return (
    <TouchableOpacity style={[util_styles.custom_checkbox, state && util_styles.custom_checkbox_checked]} onPress={() => onPress(setting,field, !state)}>
        <View style={util_styles.custom_checkbox_inside}></View>
    </TouchableOpacity>
  )
}

export default CustomCheckBox
