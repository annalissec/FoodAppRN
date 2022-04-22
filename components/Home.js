
import React, {useState, useEffect} from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import { Card, FAB, Button, List } from 'react-native-paper'

function Home(props) {

    const [data, setData] = useState([]) 
    
    const [waste, setWaste] = useState([])
    
    const [history, setHistory] = useState([])

    const [sortedData, setSortedData] = useState([])  
    const [expiredData, setExpiredData] = useState([]) 

    useEffect(() => {
        fetch('http://10.9.184.224:5000/getInstance',{
            method:'GET'
        })
        .then(resp => resp.json())
        .then(instance => {
            setData(instance)
        })
    }, [])

    useEffect(() => {
        fetch('http://10.9.184.224:5000/getUsed',{
            method:'GET'
        })
        .then(resp => resp.json())
        .then(waste => {
            setWaste(waste)
        })
    }, [])

    useEffect(() => {
        sortData(data, waste)
    }, [data, waste])

    const pickMonth = (num) => {
        var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
        return months[num-1]
    }

    const toTitleCase = (str) => {
        return str.replace(/\w\S*/g, function(txt){
            return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
        });
    } 

    function sortData(data, waste) {
        var temp = []
        var expired = []
        var used = []
        let today = new Date().toISOString().slice(0, 10)
        for (var obj of data ) {
            if (waste.some((item) => item.instance.instance_id === obj.instance_id )) {
                used.push(waste.find(item => {return item.instance.instance_id === obj.instance_id}))
            }
            else if (obj.date != null && today <= obj.date) {
                temp.push(obj)
            } 
            else {
                expired.push(obj)
            }
        }
        temp.sort(function(a, b) {return new Date(a.date) - new Date(b.date)})
        expired.sort(function(a, b) {return -1*(new Date(a.date) - new Date(b.date))})
        used.sort(function(a, b) {return new Date(a.date) - new Date(b.date)})
        setExpiredData(expired)
        setSortedData(temp)
        setHistory(used)
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

    const renderHistory = (item) => {
        return (
                <List.Accordion
                title={`${toTitleCase(item.instance.food.name)}`}
                >
                    <List.Item title={`     Quantity Used: ${item.amount_used}`}/>
                    <List.Item title={`     Quantity: ${item.instance.amount}`}/>
                </List.Accordion>
        )
    }

  return (
    <View style={{flex:1}}>

    <Text style={styles.headline}>
        Not Expired
    </Text>
        <FlatList
        data = {sortedData}
        extraData = {sortedData}
        renderItem = {({item}) => {
            return renderData(item)
        }}
        keyExtractor = {item => `${item.instance_id}`}
        />

    <Text style={styles.headline}>
        Expired
    </Text>

        <FlatList
        data = {expiredData}
        extraData = {expiredData}
        renderItem = {({item}) => {
            return renderData(item)
        }}
        keyExtractor = {item => `${item.instance_id}`}
        />

    <Text style={styles.headline}>
        History
    </Text>
        <FlatList
        data = {history}
        extraData = {history}
        renderItem = {({item}) => {
            return renderHistory(item)
        }}
        keyExtractor = {item => `${item.instance.instance_id}`}
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
    },
    headline: {
        fontWeight: '400',
        margin:10,
        padding:10,
        fontSize: 20,
        width: 200,
      }
  });

export default Home