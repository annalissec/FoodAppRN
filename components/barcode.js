import React, { useState, useEffect } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';

export default function App(props) {
  const [hasPermission, setHasPermission] = useState(null);
  //const [scanned, setScanned] = useState(false);
  const [data, setData] = useState([])
  //const [dataSet, setDataSet] = useState(false)

  useEffect(() => {
    (async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const getFromApi = (barcode) => {
    return fetch(`https://api.nutritionix.com/v1_1/item?upc=${barcode}&appId=ba17f0d8&appKey=431008e9727b8e70f58379c6cc7551de`)
      .then((response) => response.json())
      .then((json) => {
        setData(json.item_name)
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleBarCodeScanned = ({ type, data }) => {
    //setScanned(true);
    getFromApi(data)
  }

  if (hasPermission === null) {
    return <Text>Requesting for camera permission</Text>;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  function handleDataSet() {
        props.navigation.navigate('Create', {
        foodName:data
    })
  } 

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      {/* {scanned && <Button title={'Tap to Scan Again'} onPress={() => setScanned(false)} />} */}
      {data.length > 0 && handleDataSet()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});
