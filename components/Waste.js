import { Dimensions, SafeAreaView, View, Text, StyleSheet  } from 'react-native'
import Icon from 'react-native-vector-icons/Ionicons'
import React, { useEffect, useState } from 'react'
import { PieChart } from 'react-native-chart-kit'

import {COLORS} from './colors'

export default function Waste(props) {

	const screenWidth = Dimensions.get("window").width;

	const [data, setData] = useState([])
	const [instance, setInstance] = useState([])
	const [show, setShow] = useState(false)

	const chartConfig = {
		backgroundGradientFrom: "#1E2923",
		backgroundGradientFromOpacity: 0,
		backgroundGradientTo: "#08130D",
		backgroundGradientToOpacity: 0.5,
		color: (opacity = 1) => `rgba(26, 255, 146, ${opacity})`,
		strokeWidth: 1, // optional, default 3
		barPercentage: 0.5,
		useShadowColorFromDataset: false // optional
	  };

  useEffect(() => {
    fetch('http://10.9.184.224:5000/getUsed',{
        method:'GET'
    })
    .then(resp => resp.json())
    .then(waste => {
        setData(waste)
    })
}, [])

useEffect(() => {
    fetch('http://10.9.184.224:5000/getInstance',{
        method:'GET'
    })
    .then(resp => resp.json())
    .then(instance => {
        setInstance(instance)
    })
}, [])

useEffect(() => {
	setShow(data.length != 0)
})

  const addAmt = (data) => {
	  var sum = 0
    for (var obj of data) {
      sum += obj.amount_used
    }
    return sum
  }

  const addWaste = (data) => {
	  var sum = 0
    for (var obj of data) {
      sum += obj.instance.amount - obj.amount_used
    }
    return sum
  }

  var totalWaste = addWaste(data)
  var totalAmt = addAmt(data)

  const dataPie = [
	  {
		name: 'Food Wasted',
		amount: totalWaste,
		color: "#F00",
		legendFontColor: "#7F7F7F",
		legendFontSize: 12
	  },
	  {
		name: 'Food Used',
		amount: totalAmt,
		color: "rgba(131, 167, 234, 1)",
		legendFontColor: "#7F7F7F",
		legendFontSize: 12	  
	  }
  ]

  const wCost = (data) => {
	var sum = 0
	var pricePer = 0
	var wasteAmt = 0

	for (var obj of data) {
		wasteAmt = (obj.instance.amount - obj.amount_used)
		pricePer = (parseFloat(obj.instance.price) / obj.instance.amount) * wasteAmt
		sum += pricePer
	}
	return parseFloat(sum.toFixed(2))
  }

  
  const tCost = (data) => {
	  var sum = 0
    	for (var obj of data) {
			sum += parseFloat(obj.instance.price)
	  	}
	return parseFloat(sum.toFixed(2))
  }

  var wasteCost = wCost(data)
  var usedCost = parseFloat((tCost(data) - wasteCost).toFixed(2))

  const dataCost = [
	{
	  name: 'Money Wasted',
	  cost: wasteCost,
	  color: "#F00",
	  legendFontColor: "#7F7F7F",
	  legendFontSize: 12
	},
	{
	  name: 'Money Used',
	  cost: usedCost,
	  color: "rgba(131, 167, 234, 1)",
	  legendFontColor: "#7F7F7F",
	  legendFontSize: 12		  
	}
]

  return (
  	<SafeAreaView>
		  <View style={styles.container}>
			{ !show && (
				<Text style={styles.headline}>
					No Waste Data Entered Yet!
				</Text>
				
			)}
			{ !show && (
				<Icon
				name='restaurant-outline'
				size={40}
				/>
			)}
		  </View>
		{show && (
		<PieChart
			data={dataPie}
			width={screenWidth}
			height={220}
			chartConfig={chartConfig}
			accessor={"amount"}
			backgroundColor={"transparent"}
			paddingLeft={"15"}
			center={[10, 10]}
			absolute
		/>)}
		{show && (
		<PieChart
			data={dataCost}
			width={screenWidth}
			height={220}
			chartConfig={chartConfig}
			accessor={"cost"}
			backgroundColor={"transparent"}
			paddingLeft={"15"}
			center={[10, 10]}
			absolute
		/>
		)}

    </SafeAreaView >
  )
}

const styles = StyleSheet.create({
	container: {
		justifyContent: "center",
		alignItems: "center",
		
	},
	headline: {
		marginTop: 200,
        fontWeight: 'bold',
        margin:10,
        padding:10,
        fontSize: 20,
        width: 300,
		textAlign: "center",
		alignSelf: 'center'
      },
})