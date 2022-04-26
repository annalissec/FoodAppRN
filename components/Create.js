import React, {useState} from 'react'
import { View, Text, StyleSheet } from 'react-native'
import {Button, TextInput} from 'react-native-paper'

import {COLORS} from './colors'

function Create(props) {

    const [name, setName] = useState("")

    const insertData = () => {
      fetch("http://10.9.184.224:5000/addFood", {
        method: 'POST',
        headers: {
          'Content-Type':'application/json'
        },
        body: JSON.stringify({name:name})
      })
      .then(resp => resp.json())
      .then(data => {props.navigation.push('Select')}) 
      .catch(error => console.log(error))
    }
    

  return (
    <View>
        <TextInput style = {styles.inputStyle}
        label = "Name"
        value = {name}
        mode = "outlined"
        onChangeText={text => setName(text)}
        />
        <Button
        style= {{margin:10}}
        icon = "pencil"
        mode = "contained"
        onPress={() => insertData()}
        // color={COLORS.lightGreen}
        >Submit New Food</Button>
    </View>
  )
}

const styles = StyleSheet.create({
    inputStyle: {
        margin:10,
        padding: 15,
        marginTop: 30,
    }
  });

export default Create