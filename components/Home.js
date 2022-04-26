
import React, {useState, useEffect} from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import { FAB, Button, List, Checkbox } from 'react-native-paper'

import {COLORS} from './colors'

function Home(props) {

	const [checked, setChecked] = React.useState(false);

	const [data, setData] = useState([]) 
	const [waste, setWaste] = useState([])
	
	const [history, setHistory] = useState([])

	const [sortedData, setSortedData] = useState([])  
	const [expiredData, setExpiredData] = useState([]) 

	const [showNE, setShowNE] = useState(true)
	const [showE, setShowE] = useState(true)
	const [showH, setShowH] = useState(true)


	useEffect(() => {
		fetch('http://10.9.184.224:5000/getInstance',{
			method:'GET'
		})
		.then(resp => resp.json())
		.then(instance => {
			setData(instance)
		})
	}, [])

	useEffect(() => {
		fetch('http://10.9.184.224:5000/getUsed',{
			method:'GET'
		})
		.then(resp => resp.json())
		.then(waste => {
			setWaste(waste)
		})
	}, [])

	useEffect(() => {
		sortData(data, waste)
	}, [data, waste])

	useEffect(() => {
		setShowNE(sortedData.length == 0)
	})
	useEffect(() => {
		setShowE(expiredData.length == 0)
	})
	useEffect(() => {
		setShowH(history.length == 0)
	})

	const pickMonth = (num) => {
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		return months[num-1]
	}

	const toTitleCase = (str) => {
		return str.replace(/\w\S*/g, function(txt){
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	} 

	function sortData(data, waste) {
		var temp = []
		var expired = []
		var used = []

		let today = new Date().toISOString().slice(0, 10)

		for (var obj of data ) {
			if (waste.some((item) => item.instance.instance_id === obj.instance_id )) {
				used.push(waste.find(item => {return item.instance.instance_id === obj.instance_id}))
			}

			else if (obj.date != null && today <= obj.date) {
				temp.push(obj)
			} 

			else {
				expired.push(obj)
			}
		}

		temp.sort(function(a, b) {return new Date(a.date) - new Date(b.date)})
		expired.sort(function(a, b) {return -1*(new Date(a.date) - new Date(b.date))})
		used.sort(function(a, b) {return new Date(a.date) - new Date(b.date)})

		setExpiredData(expired)
		setSortedData(temp)
		setHistory(used)
	}

	const renderData = (item) => {
		return (
			<List.Accordion
				title={`${toTitleCase(item.food.name)}`}
				theme={{ colors: { primary: COLORS.lightBlue }}}
			>
				<List.Item title={`     Quantity: ${item.amount}`}/>

				<List.Item title={`     Expiring: ${item.day} ${pickMonth(item.month)} ${item.year}`}/>

				<Button
					mode="contained"
					icon="check"
					onPress={() => props.navigation.navigate("Used", {
						item:item
					})}
					color={COLORS.lightBlue}
					style={styles.button}
				>
					Did you use this item?
				</Button>
			</List.Accordion>
		)
	}

	const renderHistory = (item) => {
		return (
			<List.Accordion
				title={`${toTitleCase(item.instance.food.name)}`}
				theme={{ colors: { primary: COLORS.rust }}}
			>
				<List.Item title={`     Quantity Used: ${item.amount_used}`}/>
				<List.Item title={`     Quantity: ${item.instance.amount}`}/>
			</List.Accordion>
		)
	}

  return (
	<View style={{flex:1}}>

		<Text style={styles.headline}>
			Not Expired
		</Text>

		{showNE && (
			<Text style={styles.smallText}>
				{'\t\t\t\t\t'}No Entries Yet!
			</Text>
		)}

		<FlatList
			data = {sortedData}
			extraData = {sortedData}
			renderItem = {({item}) => {
				return renderData(item)
			}}
			keyExtractor = {item => `${item.instance_id}`}
		/>

		<Text style={styles.headline}>
			Expired
		</Text>

		{showE && (
			<Text style={styles.smallText}>
				{'\t\t\t\t\t'}No Entries Yet!
			</Text>
		)}

		<FlatList
			data = {expiredData}
			extraData = {expiredData}
			renderItem = {({item}) => {
				return renderData(item)
			}}
			keyExtractor = {item => `${item.instance_id}`}
		/>
		<View  style={styles.checkboxContainer}>
			<Text style={styles.headline}>
				History
			</Text>

			<Checkbox
				status={checked ? 'checked' : 'unchecked'}
				onPress={() => {
					setChecked(!checked)
				}}
				color={COLORS.rust}
			/>

			<Text >
				Hide History
			</Text>
		</View>
		{showH && (
			<Text style={styles.smallText}>
				{'\t\t\t\t\t'}No Entries Yet!
			</Text>
		)}

		<FlatList
			data = {history}
			extraData = {history}
			renderItem = {({item}) => {
				if (!checked){
					return renderHistory(item)
				}
			}}
			keyExtractor = {item => `${item.instance.instance_id}`}
		/>

		<FAB
			style={styles.fab}
			small={false}
			icon="plus"
			theme={{colors:{accent:COLORS.lightGreen}}}
			onPress = {() => props.navigation.navigate('Select')}
		/>

	</View>
  )
}

const styles = StyleSheet.create({
	fab: {
		position:'absolute',
		margin:20,
		right:0,
		bottom:0,
	},
	headline: {
		fontWeight: 'bold',
		margin:10,
		padding:10,
		fontSize: 25,
		width: 200,
		color: COLORS.darkGrey
	  },
	smallText: {
		fontSize: 15,
		color: COLORS.pink
	},
	checkboxContainer: {
		flexDirection: "row",
		alignItems: "center",
	  },
	button: {
		margin: 10
	}
  });

export default Home