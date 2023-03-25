import { NavigationContainer } from '@react-navigation/native';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Modal, Keyboard, Alert, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { VolunteerSelect } from './subcomponents/VolunteerSelect'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import { auth } from '../API/firebaseConfig';
import firebase from 'firebase/compat/app';
import 'firebase/compat/database'
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Regform = ({ navigation }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [contact, setContact] = useState();
  const [password, setPassword] = useState('');
  const [isVolunteer, setIsVolunteer] = useState('Тип акаунту')
  const [focus, setFocus] = useState(false)

  const [isModalVisible, setisModalVisible] = useState(false)

  const getType = async () => {
    if (contact.indexOf('@') > -1) {
      return 'Telegram'
    } else if (contact.indexOf('+') > -1) {
      return 'Номер Телефону'
    } else {
      return false
    }
  }

  const handlePress = () => {
    if (!name) {
      Alert.alert('Необхідно ввести логін')
    } else if (!email) {
      Alert.alert('Необхідно ввести електронну адресу');
    } else if (!password) {
      Alert.alert('Необхідно ввести пароль');
    } else if (isVolunteer == "Тип акаунту") {
      Alert.alert('Необхідно обрати тип акаунту');
    } else {
        auth
        .createUserWithEmailAndPassword(email, password)
        .then((userCredentials) => {
          console.log(name, email)
          firebase.database().ref('users/' + userCredentials.user.uid).set({
            name: name,
            email: email,
            isVolunteer: isVolunteer  == "Волонтер" ? true : false
          })
        }).catch(error => alert(error))
      }
  };
  const Login = () => {
    Keyboard.dismiss(),
    navigation.pop()
  }

  const changeModalVisibility = (bool) => {
    setisModalVisible(bool)
  }

  const setData = (option) => {
    setIsVolunteer(option)
  }

  return (
    <>
    <View style={styles.main}>

      <View style={{ flex: 1, justifyContent: 'center' }}>

        <TextInput
          value={email}
          placeholder='Введіть пошту'
          borderColor={'#46c433'}
          borderWidth={2}
          borderRadius={15}
          padding={15}
          fontSize={20}
          margin={'2.5%'}
          marginTop={'5%'}
          keyboardType={'email-address'}
          autoCapitalize="none"
          onChangeText={(email) => setEmail(email.trim())}>
        </TextInput>

        <TextInput
          value={name}
          placeholder="Введіть ПІБ"
          borderColor={'#46c433'}
          borderWidth={2}
          borderRadius={15}
          padding={15}
          fontSize={20}
          margin={'2.5%'}
          onChangeText={(name) => setName(name)}
          >
        </TextInput>
        
        <TouchableOpacity style={styles.choosetowndiv} onPress={() => changeModalVisibility(true)}>
            <View style={{flexDirection: 'row'}}>
              {isVolunteer == "Волонтер" ? <Text style={styles.choosetown}>{isVolunteer}</Text> :
              <Text style={styles.choosetowns}>{isVolunteer}</Text>}
              
               <View style={styles.imgIconContainer}>
                    <MaterialIcons name="location-city" size={35} color="black" />
               </View>
            </View>
        </TouchableOpacity>
        <TextInput
          value={password}
          placeholder='Введіть пароль'
          borderColor={'#46c433'}
          borderWidth={2}
          borderRadius={15}
          padding={15}
          fontSize={20}
          margin={'2.5%'}
          marginTop={'2.5%'}
          marginBottom={'5%'}
          secureTextEntry
          onChangeText={(password) => setPassword(password.trim())}>
        </TextInput>

        <View style={styles.nextdiv}>
          <TouchableOpacity style={{ backgroundColor: '#46c433', width: '80%', borderRadius: 15, paddingVertical: '4%', paddingTop: '5%' }}>
            <Text style={styles.next} onPress={handlePress}>Зареєструватись</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text style={styles.register} onPress={Login}>Вже є аккаунт? Увійти</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
    <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => changeModalVisibility(false)}>
            <VolunteerSelect
              changeModalVisibility={changeModalVisibility}
              setData={setData}
            />
        </Modal>
    </>
  );
  }

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#fff',
    flex: 1
  },

  title: {
    textAlign: "center",
    fontSize: 35,
    fontFamily: 'mt',
  },
  nextdiv: {
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

  choosetowndiv: {
    justifyContent: 'flex-start',
    flex: 1,
  },

  TownModal: {
    flex: 1,
    backgroundColor: 'yellow',
    height: '40%',
    width: '100%',
    position: 'absolute',
    bottom: 0
  },
  register: {
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
  },
  choosetown:{
    color: '#000',
    backgroundColor: '#46c433',
    fontFamily: 'mt-bold',
    fontSize: 15,
    paddingVertical: '5%',
    paddingHorizontal: '30%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  choosetowns:{
    color: '#000',
    backgroundColor: '#46c433',
    fontFamily: 'mt-bold',
    fontSize: 15,
    paddingVertical: '5%',
    paddingHorizontal: '27.5%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  choosetowndiv:{
    alignItems: 'center',
  },
  imgIconContainer:{
    paddingRight: '2%',
    paddingLeft: '2%',
    zIndex: 1,
    justifyContent: 'center',    
    alignItems: 'center',
    backgroundColor: '#46c433',
    borderTopRightRadius: 10,
    borderBottomRightRadius: 10
  },
});

export {Regform};