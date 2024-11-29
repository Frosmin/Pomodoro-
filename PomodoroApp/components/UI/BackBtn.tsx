import { MaterialCommunityIcons } from '@expo/vector-icons'
import React from 'react'
import {View,Text, TouchableOpacity} from "react-native"
import { router } from 'expo-router'

const BackBtn = () => {

    const handleClick = () => {
        router.back();
    }

  return (
    <TouchableOpacity onPress={handleClick} style={{position:"absolute", left:-20}}>
        <MaterialCommunityIcons name="arrow-left-circle" size={32} color="black" />
    </TouchableOpacity>
  )
}

export default BackBtn
