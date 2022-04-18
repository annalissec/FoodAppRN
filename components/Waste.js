import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import Pie from 'react-native-pie'


export default function Waste(props) {

  const [data, setData] = useState([])
  var totalAmt = 0
  var totalWaste = 0

  useEffect(() => {
    fetch('http://10.9.184.224:5000/getUsed',{
        method:'GET'
    })
    .then(resp => resp.json())
    .then(waste => {
        setData(waste)
    })
}, [])

  const addAmt = (data, sum) => {
    for (var obj of data) {
      sum += obj.amount_used
    }
    return sum
  }

  const addWaste = (data, sum) => {
    for (var obj of data) {
      sum += obj.instance.amount - obj.amount_used
    }
    return sum
  }

  return (
    <View>
      <Pie
          radius={70}
          series={[addAmt(data, totalAmt), addWaste(data, totalWaste)]}
          colors={['yellow', 'green']}
      />
    </View>
  )
}