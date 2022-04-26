import { View, Text, StyleSheet } from 'react-native'
import { Button, Card, HelperText, TextInput } from 'react-native-paper'
import DateTimePicker from '@react-native-community/datetimepicker'
import FakeCurrencyInput from 'react-native-currency-input'
import React, { useState } from 'react'

import {COLORS} from './colors'

export default function CreateInstance(props) {

	const {foodName, food_id, foods} = props.route.params

	const [amount, setAmt] = useState('')
	const [price, setPrc] = useState('')
	const [day, setDay] = useState('')
	const [month, setMon] = useState('')
	const [year, setYr] = useState('')
	const [show, setShow] = useState(false)

	const showDate = () => {
		setShow(true)
	}

	const insertData = () => {
		fetch("http://10.9.184.224:5000/addInstance", {
			method:'POST',
			headers: {
			'Content-Type':'application/json'
			},
			body: JSON.stringify({food_id:food_id, price:parseFloat(price ? price : 0), amount:parseInt(amount ? amount : 0), month:month, day:day, year:year})
		})
		.then(resp => resp.json())
		.then(data => {
			props.navigation.push('Home')
		})
		.catch(error => console.log(error))
	}

	const hasErrors = (result) => {
		error = !(result == -1)
	}

	const onChange = (event, dateEntry) => {
	  setShow(false)
	  expDate = new Date(dateEntry || new Date())
	  console.log(expDate)
	  setDay(expDate.getDate())
	  setMon(expDate.getMonth()+1)
	  setYr(expDate.getFullYear())
	}

	const pickMonth = (num) => {
	  var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
	  return months[num-1]
  }

  const toTitleCase = (str) => {
	return str.replace(/\w\S*/g, function(txt){
		return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
	});
} 

  return (
	<View>
		<Card style={styles.cardStyle}>
	<Text style={styles.text}>
		Food: {toTitleCase(foodName)}
	</Text>
		</Card>

	<Card style={styles.cardStyle}>
		<FakeCurrencyInput
			style={styles.text}
			value={amount ? amount : 0}
			onChangeValue={(amount)=> {
				setAmt(amount)
				console.log(amount)
			}}
			prefix='Amount: '
			delimiter=''
			separator=""
			precision={0}
		/>
	</Card>

	<Card style={styles.cardStyle}>
		<FakeCurrencyInput
			style={styles.text}
			value={price ? price : 0}
			onChangeValue={(price) => {
				setPrc(price)
				console.log(price)
			}}
			prefix="Price: $"
			delimiter=","
			separator="."
			precision={2}
		/>
	</Card>

	<Card 
		style={styles.cardStyle}
		onPress={() => 
			showDate()
		}
	>
		<Text style={styles.text}>
			Date: {day} {pickMonth(month)} {year}
		</Text>
	</Card>

	{show && (
		<DateTimePicker 
			mode="date"
			value={new Date()}
			onChange={onChange}
		/>
	)}

	<Button
		style={styles.button}
		icon="plus"
		mode="contained"
		onPress={() => insertData()}
		color={COLORS.lightBlue}
	>
		Add Food
	</Button>

	</View>
)}

const styles = StyleSheet.create({
	cardStyle: {
		margin:10,
		padding:12,
	},
	text: {
		fontSize:17
	},
	button: {
		margin: 10,
		padding: 4
	},
})