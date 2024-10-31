import React from 'react'
import { StyleSheet,Animated,TouchableOpacity,Text } from 'react-native'

const Button1 = ({content}: {content: string}) => {
  return (
    <TouchableOpacity style={styles.button}>
      <Text style={styles.text}>{content}</Text>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    
  },
  text: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});




export default Button1
