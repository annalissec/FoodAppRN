
import React from 'react'
import {View, Text, FlatList, StyleSheet} from 'react-native'
import { Card, FAB } from 'react-native-paper'

function Home(props) {

    const data = [
        {id: 1, name: 'apple'}
    ]

    const renderData = (item) => {
        return (
            <Card style={styles.cardStyle}>
                <Text>{item.name}</Text>
            </Card>
        )
    }

  return (
    <View style={{flex:1}}>
        <FlatList
        data = {data}
        renderItem = {({item}) => {
            return renderData(item)
        }}
        keyExtractor = {item => `${item.id}`}
        />

        <FAB
        style={styles.fab}
        small={false}
        icon="plus"
        theme={{colors:{accent:"green"}}}
        onPress = {() => console.log("Pressed")}
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
        margin:16,
        right:0,
        bottom:0,
    }
  });

export default Home