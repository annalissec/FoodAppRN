import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import Icon from 'react-native-vector-icons/Ionicons'

const Legend = (props) => {
  return (
	<View style={styles.container}>
		<Icon name="square" color={props.iconColor} size={20}/>
		<Text>{"	"}</Text>
	  	<Text style={styles.text} >{props.legendText}</Text>
		<Text style={{
			fontWeight:'bold',
			color:props.iconColor,
			fontSize:20
			}}
		>
			{props.number}
		</Text>
	</View>
  )
}

const styles = StyleSheet.create({
	container: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent:'flex-end',
		
	  },
	  text: {
		padding: 3,
		margin: 4
	  },


})

export default Legend