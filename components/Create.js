import React, {useState, useEffect} from 'react'
import { View, StyleSheet, } from 'react-native'
import {Button, TextInput} from 'react-native-paper'

import {COLORS} from './colors'

function Create(props) {

	const {foodName} = props.route.params

	const [name, setName] = useState("")

	const insertData = () => {
	  fetch("http://10.9.184.224:5000/addFood", {
		method: 'POST',
		headers: {
		  'Content-Type':'application/json'
		},
		body: JSON.stringify({name:name})
	  })
	  .then(resp => resp.json())
	  .then(data => {
		  if (data)
		  	props.navigation.push('Select')
		}) 
	  .catch(error => console.log(error))
	}
	

  return (
	<View>
		<TextInput style = {styles.inputStyle}
			label = "Name"
			value = {foodName != null ? foodName : name}
			mode = "outlined"
			onChangeText={text => setName(text)}
			theme={{ colors: { primary: COLORS.darkGreen}}}
		/>
		<Button
			style= {{margin:10}}
			icon = "pencil"
			mode = "contained"
			onPress={() => insertData()}
			color={COLORS.lightGreen}
		>
			Submit New Food
		</Button>
	</View>
  )
}

const styles = StyleSheet.create({
	inputStyle: {
		margin:10,
		padding: 10,
		marginTop: 30,
	},
  })

export default Create