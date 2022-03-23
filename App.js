import { StatusBar } from 'expo-status-bar'
import { StyleSheet, Text, View } from 'react-native'
import Home from './components/Home'
import Contants from 'expo-constants'

export default function App() {

  const test = "this is a test"

  return (
    <View style={styles.container}>
      <Home test = {test}/>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#eddfdf',
    marginTop:Contants.statusBarHeight
  },
});
