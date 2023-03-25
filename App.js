import { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions } from 'react-native';
import { Stacks } from './navigation';
import * as Font from 'expo-font';
import AppLoading from 'expo-app-loading';
import { NavigationContainer } from '@react-navigation/native';

const WIDTH = Dimensions.get('window').width

export default function App() {
  const fonts = () => Font.loadAsync({
    'mt': require('./assets/fonts/Montserrat.ttf'),
    'mt-med': require('./assets/fonts/Montserrat-SemiBold.ttf'),
    'mt-bold': require('./assets/fonts/Montserrat-Bold.ttf')
  });
  const [font, setFont] = useState(false);

  if (font) {
    return (
      <NavigationContainer>
        <Stacks/>
      </NavigationContainer>
    );
  }
  else {
    return (
      <AppLoading
        startAsync={fonts}
        onFinish={() => setFont(true)}
        onError={console.warn}
      />
    )
  }
}