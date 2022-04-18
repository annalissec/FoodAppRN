import { View, Text } from 'react-native'
import { Button, TextInput, HelperText } from 'react-native-paper'
import React, {useState} from 'react'

export default function Used(props) {

    const {item} = props.route.params
    const [amount_used, setAmt] = useState('')

    const onChangeAmt = used => {
      setAmt(used)
    }

    const insertData = () => {
        fetch("http://10.9.184.224:5000/addUsed", {
          method:'POST',
          headers: {
            'Content-Type':'application/json'
          },
          body: JSON.stringify({instance_id:item.instance_id, amount_used:amount_used})
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
  

  return (
    <View>
      <Text>{item.food.name}</Text>
        <Text>Total Amount: {item.amount}</Text>
      <TextInput
      label="Amount Used"
      value={amount_used}
      onChangeText={onChangeAmt}
      keyboardType='numeric'
      />
      <HelperText type='error' visible= {hasNumErrors(amount_used)}>
          please enter only number values
      </HelperText>
      <Button
      mode='contained'
      icon='check'
      onPress={() => insertData()}
      >Add Amount Used</Button>
    </View>
  )
}