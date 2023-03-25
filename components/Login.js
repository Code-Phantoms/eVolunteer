import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Dimensions, Alert, Keyboard, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import signIn from '../API/firebaseConfig'
import { auth } from '../API/firebaseConfig';
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Login = ({navigation}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handlePress = () => {
    if (!email) {
      Alert.alert('Необхідно ввести електронну пошту');
    } else if (!password) {
      Alert.alert('Необхідно ввести пароль');
    } else {
      auth
      .signInWithEmailAndPassword(email, password)
      .then(userCredentials => {
        const user = userCredentials.user;
      }).catch(error => alert(error))
    }
  };
  const Register = () => {
  Keyboard.dismiss(),
  navigation.navigate('Register')};

    return (
      <SafeAreaView style={styles.main}>
      <View style={{flex: 1, justifyContent: 'center'}}>

      <TextInput
      value={email}
      placeholder='Введіть пошту'
      borderColor={'#46c433'}
      borderWidth={2}
      borderRadius={15}
      padding={15}
      fontSize={20}
      margin={'2.5%'}
      keyboardType={'email-address'}
      autoCapitalize="none"
      onChangeText={(email) => setEmail(email.trim())}>
      </TextInput>

      <TextInput
      value={password}
      placeholder='Введіть пароль'
      borderColor={'#46c433'}
      borderWidth={2}
      borderRadius={15}
      padding={15}
      fontSize={20}
      margin={'2.5%'}
      marginTop={'5%'}
      marginBottom={'8%'}
      secureTextEntry
      onChangeText={(password) => setPassword(password.trim())}>
      </TextInput>
     <View style={styles.nextdiv}>
       <TouchableOpacity onPress={handlePress} style={{backgroundColor: '#46c433', width: '80%', borderRadius: 15, paddingVertical: '4%', paddingTop: '5%'}}>
           <Text style={styles.next}>Увійти</Text>
       </TouchableOpacity>
       <TouchableOpacity>
           <Text style={styles.login} onPress={Register}>Нема акаунта? Зареєструватись</Text>
       </TouchableOpacity>
     </View>
     </View>
      </SafeAreaView>
    );
  }

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#fff',
  },

  title: {
    textAlign: "center",
    fontSize: 35,
    fontFamily: 'mt',
  },
  nextdiv:{
    alignItems: 'center',
    justifyContent: 'flex-end'
  },
  next: {
    textAlign: 'center',
    color: "#fff",
    fontSize: 20,
    borderRadius: 15,
    fontFamily: 'mt-med',
    marginBottom: '2%',
    paddingHorizontal: '8%'
  },
  choosetown:{
    marginLeft: '2.5%',
    marginRight: '2.5%',
    textAlign: 'center',
    color: "black",
    backgroundColor: '#46c433',
    paddingVertical: '5%',
    fontSize: 20,
    borderRadius: 15,
    fontFamily: 'mt',
  },

  choosetowndiv:{
    justifyContent: 'flex-start',
    flex: 1,
  },

  login:{
    textAlign: 'center',
    width: '100%',
    color: "black",
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
    fontSize: 15,
    fontFamily: 'mt-med',
    marginBottom: '2%',
    color: '#46c433'
  }
});

export {Login};