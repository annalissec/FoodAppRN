import React, {useState, useEffect} from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Button, FAB, Text } from 'react-native-paper'
import Icon from 'react-native-vector-icons/Ionicons'

import {COLORS} from './colors'

function Select(props) {

	const [data, setData] = useState([])
	const [show, setShow] = useState(false)

	useEffect(() => {
		fetch('http://10.9.184.224:5000/getFood',{
			method:'GET'
		})
		.then(resp => resp.json())
		.then(food => {
			setData(food)
		})
	}, [])

	useEffect(() => {
		setShow(data.length == 0)
	})

	const renderData = (item) => {
		return(
		<View style={styles.buttonContainer}>
			<Button 
				style={styles.button} 
				onPress={() => 
					props.navigation.navigate('CreateInstance', {
						foodName: item.name,
						food_id: item.food_id,
						foods: data
					})}
				color={COLORS.darkGrey}
				labelStyle={{
					fontWeight:'bold',
					fontSize: 17
				}}
			>
				{item.name}
			</Button>
			<Icon
				name="information-circle-outline"
				onPress={()=>{
					console.log('pressed')
				}}
				size={25}
				color={COLORS.lightRust}
			/>
		</View>)
	}

  return (
	<View style={{flex:1, alignItems:'center'}}>
		{show && (
		<View style={styles.container}>
			<Text style={styles.headline}>
				Please Enter Some Food Types!
			</Text>	
		
			<Icon
				name='pizza-outline'
				size={40}
				color={COLORS.rust}
			/>
		</View>
			)}

		<FlatList
		data = {data}
		renderItem = {({item}) => {
			return renderData(item)
		}}
		keyExtractor = {item => `${item.food_id}`}
		/>

		<FAB
		style={styles.fab}
		small={false}
		icon="plus"
		theme={{colors:{accent:"#b1c48f"}}}
		onPress = {() => props.navigation.navigate('Create')}
		/>
	</View>
  )
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		fontWeight: 'bold',
		
	},
	buttonContainer: {
		flexDirection: "row",
		alignItems: "center",
		justifyContent:'space-between'
	  },
	button: {
		margin: 2,
		padding:3,

	},
	fab: {
		position:'absolute',
		margin:16,
		right:0,
		bottom:0,
	},
	headline: {
		marginTop: 200,
		fontWeight: 'bold',
		margin:10,
		padding:10,
		fontSize: 20,
		width: 300,
		textAlign: "center",
		alignSelf: 'center',
		color: COLORS.darkGrey
	  },
})

export default Select