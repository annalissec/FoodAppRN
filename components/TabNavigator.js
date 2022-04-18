import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Icon from 'react-native-vector-icons/Ionicons';

import Home from "./Home";
import Waste from "./Waste";

const Tab = createMaterialBottomTabNavigator()

const Tabs = () => {
    return (
        <Tab.Navigator>
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

export default Tabs