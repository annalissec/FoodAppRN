import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

import Create from './components/Create'
import Select from './components/Select'
import CreateInstance from './components/CreateInstance'
import Used from './components/Used'
import Waste from './components/Waste'
import Home from './components/Home'
import Barcode from './components/barcode'

import {COLORS} from './components/colors'

import Contants from 'expo-constants'

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs'

import Icon from 'react-native-vector-icons/Ionicons'

const Stack = createStackNavigator()
const Tab = createMaterialBottomTabNavigator()

//figure out how the heck these tabs work :(

function HomeTabs(){
  return(
	<Tab.Navigator
	barStyle={{ 
		backgroundColor:COLORS.darkGreen,
		// borderTopLeftRadius:15,
		// borderTopRightRadius:15,
		// height:50
	
	}}
	>
		<Tab.Screen name="Home" component={Home} options={{
				tabBarlabel: 'Home',
				tabBarColor: '#009387',
				tabBarIcon: ({color}) => (
					<Icon name='home' color={color} size={26}/>
				)
			}}
		/>
		<Tab.Screen name="Waste" component={Waste} options={{
				tabBarlabel: 'Waste',
				tabBarColor: '#1f65ff',
				tabBarIcon: ({color}) => (
					<Icon name='trash' color={color} size={26}/>
				)
			}}/>
	</Tab.Navigator>
  )
}

function App() {

  return (
	<View style={styles.container}>
		<Stack.Navigator>
			<Stack.Screen name ="Home" options={{
				title: "",
				headerStyle: {
					backgroundColor: COLORS.topBar,
				  },
				headerTintColor: COLORS.darkGreen,
			}} 
				component={HomeTabs}/>
			<Stack.Screen name ="Create" options={{title: "Add New Food"}} component={Create}/>
			<Stack.Screen name ="Select" options={{title: "Select Food Type"}} component={Select}/>
			<Stack.Screen name ="Used" options={{title: "Enter Amount Used"}} component={Used}/>
			<Stack.Screen name ="CreateInstance" options={{title: "Add New Food"}} component={CreateInstance}/>
			<Stack.Screen name ="Waste" options={{title: "Waste Data"}} component={Waste}/>
			<Stack.Screen name ="Barcode" options={{title: "Barcode"}} component={Barcode}/>
		</Stack.Navigator>
	</View>
  );
}

export default() => {
  return(
	<NavigationContainer>
		<App/>
	</NavigationContainer>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
    marginTop:Contants.statusBarHeight
  },
});
