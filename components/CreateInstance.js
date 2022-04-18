import { View, Text, StyleSheet } from 'react-native'
import { Button, HelperText, TextInput } from 'react-native-paper'
import React, { useState } from 'react'

export default function CreateInstance(props) {

    const {foodName, food_id, foods} = props.route.params
    const [amount, setAmt] = useState('')
    const [price, setPrc] = useState('')
    const [day, setDay] = useState('')
    const [month, setMon] = useState('')
    const [year, setYr] = useState('')

    const onChangeAmt = text => setAmt(text)
    const onChangePrc = text => setPrc(text)
    const onChangeDay = text => setDay(text)
    const onChangeMon = text => setMon(text)
    const onChangeYr = text => setYr(text)

    const insertData = () => {
      fetch("http://10.9.184.224:5000/addInstance", {
        method:'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({food_id:food_id, price:price, amount:amount, month:month, day:day, year:year})
      })
      .then(resp => resp.json())
      .then(data => {
        props.navigation.push('Home')
      })
      .catch(error => console.log(error))
    }


    const hasNumErrors = (item) => {
        let isFloat = /^\d*\.?\d+$/.test(item)
        let isNum = /^\d*$/.test(item)
        return !isNum && !isFloat
    }

    const hasErrors = (result) => {
        error = !(result == -1)
    }

  return (
    <View>
        <Text>
            {foodName} {food_id}
        </Text>
        <TextInput
        label="Amount"
        keyboardType='numeric'
        value={amount}
        onChangeText={onChangeAmt}
      />
      <HelperText type='error' visible= {hasNumErrors(amount)}>
          please enter only number values
      </HelperText>
      <TextInput
        label="Price"
        value={price}
        keyboardType="numeric"
        onChangeText={onChangePrc}
      />
      <HelperText type='error' visible= {hasNumErrors(price)}>
          please enter only valid price
      </HelperText>
      <TextInput
        label="Day"
        onChangeText={onChangeDay}
        keyboardType='numeric'
      />
      <HelperText type='error' visible= {hasNumErrors(day)}>
          please enter only number values
      </HelperText>
      <TextInput
        label="Month"
        onChangeText={onChangeMon}
        keyboardType='numeric'
      />
      <HelperText type='error' visible= {hasNumErrors(month)}>
      please enter only number values
      </HelperText>
      <TextInput
        label="Year"
        onChangeText={onChangeYr}
        keyboardType='numeric'
      />
      <HelperText type='error' visible= {hasNumErrors(year)}>
          please enter only number values
      </HelperText>

    <Button
    icon="plus"
    mode="contained"
    onPress={() => insertData()}
    >Add Food</Button>

    </View>
  )
}

const styles = StyleSheet.create({
  contentView: {
      flex: 1,
      flexDirection:'row'
  }
});