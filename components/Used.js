import { View, Text, StyleSheet } from 'react-native'
import { Button, Card, HelperText } from 'react-native-paper'
import { FakeCurrencyInput } from 'react-native-currency-input'
import React, {useState, useEffect} from 'react'

import {COLORS} from './colors'

export default function Used(props) {

		const {item} = props.route.params
		const [amount_used, setAmt] = useState('')

		const insertData = () => {
				fetch("http://10.9.184.224:5000/addUsed", {
					method:'POST',
					headers: {
						'Content-Type':'application/json'
					},
					body: JSON.stringify({instance_id:item.instance_id, amount_used: parseInt( amount_used ? amount_used : 0)})
				})
				.then(resp => resp.json())
				.then(data => {
					props.navigation.push('Home')
				})
				.catch(error => console.log(error))
			}

		const hasNumErrors = (price) => {
				return price > item.amount
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
					Food: {toTitleCase(item.food.name)}
				</Text>
			</Card>

			<Card style={styles.cardStyle}>
				<Text style={styles.text}>
					Total Amount: {item.amount}
				</Text>
			</Card>
			
			<Card style={styles.inputCardStyle}>
				<FakeCurrencyInput
					style={styles.text}
					value={amount_used ? amount_used : 0}
					onChangeValue={(amount_used)=> {
						setAmt(amount_used)
						console.log(amount_used)
					}}
					prefix='Amount: '
					delimiter=''
					separator=""
					precision={0}
					/>
			</Card>

			<HelperText type='error' visible= {hasNumErrors(amount_used)}>
					please enter number less than or equal to total amount
			</HelperText>

			<Button
				mode='contained'
				icon='check'
				onPress={() => insertData()}
				style={styles.button}
				color={COLORS.lightBlue}
			>
				Add Amount Used
			</Button>
		</View>
	)
}

const styles = StyleSheet.create({
	cardStyle: {
		margin:10,
		padding:12,
	},
	inputCardStyle: {
		margin:10,
		padding:10,

	},
	text: {
		fontSize:15
	},
	button: {
		margin: 10,
		padding:4
	}
});