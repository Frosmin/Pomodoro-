import React from 'react'
import BackBtn from './BackBtn'
import {Text, View,StyleSheet} from 'react-native'
import util_styles from '@/styles/utils'
import { colors } from '@/styles/colors'

const SectionHeader = ({text = " "} : {text : string}) => {
  return (
    <View style={[styles.section_header]}>
        <BackBtn/>
        <View style={[util_styles.flex_row,{justifyContent:"center", width:"100%"}]}>
            <Text style={[util_styles.title,{textAlign:"center"}]}>{text}</Text>
        </View>
    </View>
  )
}

const styles = StyleSheet.create({
    section_header:{
        display:"flex",
        flexDirection:"row",
        alignItems:"center",
        justifyContent: "center",
        borderColor: colors.neutral_200,
        borderBottomWidth: 0.5,
    }
})

export default SectionHeader
