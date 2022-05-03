
import React, {useState, useEffect, useRef} from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import { FAB, Button, List, Checkbox } from 'react-native-paper'
import * as Notifications from 'expo-notifications'
import Constants from 'expo-constants'

Notifications.setNotificationHandler({
	handleNotification: async () => ({
		shouldShowAlert: true,
		shouldPlaySound: false,
		shouldSetBadge: true,
	})
})

import {COLORS} from './colors'

export default function Home(props) {

	const [expoPushToken, setExpoPushToken] = useState('')
	const [notification, setNotification] = useState(false)
	const notificationListener = useRef()
	const responseListener = useRef()

	const [checked, setChecked] = React.useState(false);

	const [data, setData] = useState([]) 
	const [waste, setWaste] = useState([])
	
	const [history, setHistory] = useState([])

	const [sortedData, setSortedData] = useState([])  
	const [expiredData, setExpiredData] = useState([]) 

	const [notifData, setNotifData] = useState([])

	const [showNE, setShowNE] = useState(true)
	const [showE, setShowE] = useState(true)
	const [showH, setShowH] = useState(true)

	useEffect(() => {
		registerForPushNotificationsAsync().then(token => setExpoPushToken(token));
	
		notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
		  setNotification(notification);
		});
	
		responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
		  console.log(response);
		});
	
		return () => {
		  Notifications.removeNotificationSubscription(notificationListener.current);
		  Notifications.removeNotificationSubscription(responseListener.current);
		};
	  }, [])

	useEffect(() => {
		fetch('http://10.9.184.224:5000/getInstance',{
			method:'GET'
		})
		.then(resp => resp.json())
		.then(instance => {
			//console.log(instance)
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

	useEffect(() => {
		let arr = []
		for (let item of sortedData) {
			if (reminder(item)) {
				arr.push(item)
			}
		}
		if (arr.length != 0){
			setNotifData(arr)
		}
	}, [showNE])

	useEffect(() => {
		scheduleNotifs(notifData)
	}, [notifData])

	const pickMonth = (num) => {
		var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
		return months[num-1]
	}

	const toTitleCase = (str) => {
		return str.replace(/\w\S*/g, function(txt){
			return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
		});
	} 

	function reminder(item) {
		let currDate = new Date()
		let tempDate = new Date()
		let approachingDate = new Date(tempDate.setDate(tempDate.getDate() + 5))
		let itemDate = new Date(item.year, item.month -1, item.day)

		approachingDate.setHours(0, 0, 0, 0)
		itemDate.setHours(0, 0, 0, 0)
		currDate.setHours(0, 0, 0, 0)

		return (itemDate.getTime() === approachingDate.getTime()) || (itemDate.getTime() < approachingDate.getTime() && itemDate.getTime() >= currDate.getTime())
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

	const getColor = (item) => {
		if (reminder(item)){
			return COLORS.lightRust
		}
		else {
			return COLORS.darkGrey
		}
	}

	const renderData = (item) => {
		return (
			<List.Accordion
				title={`${toTitleCase(item.food.name)}`}
				titleStyle={{color: getColor(item)}}
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

	const scheduleNotifs = async(notifData) => {
		let str = ""
		let opt1 = " are expiring soon!"
		let opt2 = " is expiring soon!"
		await Notifications.cancelAllScheduledNotificationsAsync();
		for (let item of notifData) {
			if (item == notifData[0]) {
				str += toTitleCase(item.food.name) 
			} 

			else if (notifData.length == 2) {
				str += " and "
				str += toTitleCase(item.food.name)
			}

			else if (notifData.length > 2 && item == notifData[notifData.length-1]) {
				str += ", and "
				str += toTitleCase(item.food.name) 
			}
			
			else {
				str += ", "
				str += toTitleCase(item.food.name) 
			}
		}

		if (notifData.length > 1) {
			str += opt1
		} else {
			str += opt2
		}

		await Notifications.scheduleNotificationAsync({
			identifier: "Food Notif",
			content: {
				title: "You have items expiring within the next five days!",
				body: `${str}`,
				color: "#ffffff",
				data: {
					to: 'new-log'
				}
			},
			//TODO: fix trigger
			trigger: {
				hour: 13,
				minute: 46,
				//seconds: 1,
				repeats: true
			}
		})

		let test = Notifications.getAllScheduledNotificationsAsync()
		//console.log(test)
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

  async function registerForPushNotificationsAsync() {
	let token;
	try {
		const { status: existingStatus } = await Notifications.getPermissionsAsync()
		let finalStatus = existingStatus
		if (existingStatus !== 'granted') {
		  const { status } = await Notifications.requestPermissionsAsync()
		  finalStatus = status
		}
		if (finalStatus !== 'granted') {
		  throw new Error('Permission not granted!')
		}
		const token = (await Notifications.getExpoPushTokenAsync()).data
		return token
	  } catch (error) {
		console.error(error)
	  }
  
	if (Platform.OS === 'android') {
	  Notifications.setNotificationChannelAsync('default', {
		name: 'default',
		importance: Notifications.AndroidImportance.MAX,
		vibrationPattern: [0, 250, 250, 250],
		lightColor: '#FF231F7C',
	  });
	}
}

