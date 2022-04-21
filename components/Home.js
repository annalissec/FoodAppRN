
import React, {useState, useEffect} from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import { Card, FAB, Button, List, BottomNavigation } from 'react-native-paper'

function Home(props) {

    const [data, setData] = useState([])    

    useEffect(() => {
        fetch('http://10.9.184.224:5000/getInstance',{
            method:'GET'
        })
        .then(resp => resp.json())
        .then(instance => {
            setData(instance)
        })
    }, [])

    const setUsed = () => {
        fetch("http://10.9.184.224:5000/addUsed", {
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

    const pickMonth = (num) => {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months[num-1]
    }

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    }

    const renderData = (item) => {
        return (
                <List.Accordion
                title={`${toTitleCase(item.food.name)}`}
                >
                    <List.Item title={`     Quantity: ${item.amount}`}/>
                    <List.Item title={`     Expiring: ${item.day} ${pickMonth(item.month)} ${item.year}`}/>
                    <Button
                    mode="contained"
                    icon="check"
                    onPress={() => props.navigation.navigate("Used", {
                        item:item
                    })}
                    >
                        Did you use this item?
                    </Button>
                
                </List.Accordion>
        )
    }

  return (
    <View style={{flex:1}}>
        <FlatList
        data = {data}
        renderItem = {({item}) => {
            return renderData(item)
        }}
        keyExtractor = {item => `${item.instance_id}`}
        />

        <FAB
        style={styles.fab}
        small={false}
        icon="plus"
        theme={{colors:{accent:"green"}}}
        onPress = {() => props.navigation.navigate('Select')}
        />
    </View>
  )
}

const styles = StyleSheet.create({
    cardStyle: {
      margin:10,
      padding:10
    },
    fab: {
        position:'absolute',
        margin:20,
        right:0,
        bottom:0,
    }
  });

export default Home