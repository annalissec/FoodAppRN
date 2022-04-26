import React, {useState, useEffect} from 'react'
import { View, StyleSheet, FlatList } from 'react-native'
import { Button, FAB } from 'react-native-paper'

//alphabetize the flatlist

function Select(props) {

    const [data, setData] = useState([])

    useEffect(() => {
        fetch('http://10.9.184.224:5000/getFood',{
            method:'GET'
        })
        .then(resp => resp.json())
        .then(food => {
            setData(food)
        })
    }, [])

    const renderData = (item) => {
        return(
        <View>
            <Button style={styles.button} onPress={() => props.navigation.navigate('CreateInstance', {
                foodName: item.name,
                food_id: item.food_id,
                foods: data
            })} color='black'>
                    {item.name}
            </Button>
        </View>)
    }

  return (
    <View style={{flex:1}}>
        <FlatList
        data = {data}
        renderItem = {({item}) => {
            return renderData(item)
        }}
        keyExtractor = {item => `${item.food_id}`}
        />

        <FAB
        style={styles.fab}
        small={false}
        icon="plus"
        theme={{colors:{accent:"#b1c48f"}}}
        onPress = {() => props.navigation.navigate('Create')}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    button: {
        margin:1,
        padding:5,

    },
    fab: {
        position:'absolute',
        margin:16,
        right:0,
        bottom:0,
    },
    


})

export default Select