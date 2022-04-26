import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'

import Create from './components/Create'
import Select from './components/Select'
import CreateInstance from './components/CreateInstance'
import Used from './components/Used'
import Waste from './components/Waste'

import Tabs from './components/TabNavigator'

import {COLORS} from './components/colors'

import Contants from 'expo-constants'

import { createStackNavigator } from '@react-navigation/stack'
import { NavigationContainer } from '@react-navigation/native'

const Stack = createStackNavigator()

function HomeStack(){
  return(
    <Tabs/>
  )
}

function App() {

  return (
	<View style={styles.container}>
		<Stack.Navigator>
			<Stack.Screen name ="Home" options={{
				title: "Items",
				headerStyle: {
					backgroundColor: COLORS.topBar,
				  },
				headerTintColor: COLORS.darkGreen,
			}} 
				component={HomeStack}/>
			<Stack.Screen name ="Create" options={{title: "Add New Food"}} component={Create}/>
			<Stack.Screen name ="Select" options={{title: "Select Food Type"}} component={Select}/>
			<Stack.Screen name ="Used" options={{title: "Enter Amount Used"}} component={Used}/>
			<Stack.Screen name ="CreateInstance" options={{title: "Add New Food"}} component={CreateInstance}/>
			<Stack.Screen name ="Waste" options={{title: "Waste Data"}} component={Waste}/>
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
