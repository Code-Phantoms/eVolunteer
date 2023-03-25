import { useState, useEffect } from 'react';
import { LogBox } from 'react-native';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, Dimensions, Image, Modal } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import firebase from 'firebase/compat/app'
import 'firebase/compat/firestore'
import {auth} from "../API/firebaseConfig"
import moment from 'moment';
import 'moment/locale/uk'  // Переклад часу українською
moment.locale('uk');

LogBox.ignoreLogs(['Warning: Can\'t perform a React state update on an unmounted component. This is a no-op, but it indicates a memory leak in your application. To fix, cancel all subscriptions and asynchronous tasks in a useEffect cleanup function.']);
LogBox.ignoreLogs(['Setting a timer for a long period of time', '[react-native-gesture-handler]', 'AsyncStorage has been extracted', 'The action \'GO_BACK\' was not handled by any navigator.'])

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export const MainPage = ({navigation}) => {

  const [visible, setVisible] = useState(false)

  const [posts, setPosts] = useState([])
  // 25
  const cities = [
    'Київська область',
    'Вінницька область',
    'Волинська область',
    'Дніпропетровська область',
    'Донецька область',
    'Житомирська область',
    'Закарпатська область',
    'Запорізька область',
    'Івано-Франківська область',
    'Київська область',
    'Кіровоградська область',
    'Луганська область',
    'Львівська область',
    'Миколаївська область',
    'Одеська область',
    'Полтавська область',
    'Рівненська область',
    'Сумська область',
    'Тернопільська область',
    'Харківська область',
    'Херсонська область',
    'Хмельницька область',
    'Черкаська область',
    'Чернівецька область',
    'Чернігівська область']
  
    const [isVolunteer, setIsVolunteer] = useState('')
    
    useEffect(() => {
    firebase.database().ref(`users/${auth.currentUser.uid}`).once('value').then(snapshot => {
      setIsVolunteer(snapshot.val().isVolunteer)
    });
  }, []);

  useEffect(() => {
    if (isVolunteer) {
    firebase.firestore().collection('posts').orderBy('date', 'desc').onSnapshot(querySnapshot => {
        const posts = [];
  
        querySnapshot.docs.forEach(documentSnapshot => {
          posts.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setPosts(posts);
      }); 
    } else {
      firebase.firestore().collection('posts').orderBy('date', 'desc').where('authorId', '==', auth.currentUser.uid).get()
      .then((querySnapshot) => {
        const posts = [];
  
        querySnapshot.docs.forEach(documentSnapshot => {
          posts.push({
            ...documentSnapshot.data(),
            key: documentSnapshot.id,
          });
        });
  
        setPosts(posts);
      }); 
    }
  }, []);

  return (
    <View style={{flex: 1}}>
        <TouchableOpacity style={styles.categview} onPress={() => setVisible(true)}>
            <Text style={styles.category}>Вся країна</Text>
        </TouchableOpacity>
        <FlatList 
          data={posts}
          numColumns={2}
          ListEmptyComponent={
            <View style={{justifyContent: 'center', alignItems: 'center', flex: 1}}>
                <Text style={{ fontFamily: 'mt', textAlign: 'center', justifyContent: 'center' }}>Ми не знайшли жодного оголошення</Text>
            </View>}
          renderItem={({item}) => (
           <TouchableOpacity style={styles.recblock} onPress={() => navigation.navigate('Full',
           {
            authorId: item.authorId,
            image: item.image.toString(),
            city: item.city,
            full: item.full,
            latitude: item.latitude,
            longitude: item.longitude,
            date: moment(item.date.toDate()).fromNow(),
           })}>
              <View style={{alignItems: 'center'}}>
                  <Image source={{uri: item.image}} style={styles.blockimage} />
              </View>
              <Text style={styles.blocktown}>{item.city}</Text>
              <Text style={styles.blockDate}>{moment(item.date.toDate()).fromNow().charAt(0).toUpperCase() + moment(item.date.toDate()).fromNow().slice(1)}</Text>
           </TouchableOpacity>
        )} 
        />
        <TouchableOpacity style={styles.floatingButton} onPress={() => navigation.navigate('CreatePage')}>
          <AntDesign name="plus" size={35} color="white" />
        </TouchableOpacity>
        <Modal
        animationType={'fade'}
        transparent={true}
        visible={visible}>
          <View style={styles.modal} onPress={() => setVisible(false)}>
            
            <FlatList 
              data={cities}
              keyExtractor={(item, index) => 'key'+index}
              ListHeaderComponent={
                <TouchableOpacity style={styles.option} onPress={() => {
                  setVisible(false)
                  navigation.reset({
                    index: 0,
                    routes: [{ name: 'MainPage' }],
                  });
                }}>
                  <Text style={styles.cityname}>Вся країна</Text>
                </TouchableOpacity>
              }
              renderItem={({item}) => (
                <TouchableOpacity style={styles.option} onPress={() => {
                  setVisible(false)
                  navigation.navigate('SearchPage', {
                  city: item.toString()
                })
                console.log(item)
                }}>
                    <Text style={styles.cityname}>{item}</Text>
                </TouchableOpacity>
            )}
            />
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  category:{
    marginTop: '3%',
    fontFamily: 'mt-med',
    fontSize: 25,
    backgroundColor: '#46c433',
    textAlign: 'center',
    padding: '4%',
    paddingHorizontal: '20%',
    borderRadius: 15
  },
  categview:{
    alignItems: 'center',
    marginHorizontal: '10%',
    marginBottom: '3%'
  },
  floatingButton:{
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    position: 'absolute',
    bottom: 10,
    right: 10,
    height: 70,
    backgroundColor: '#46c433',
    borderRadius: 100,
  },
  recblock:{
    width: WIDTH / 2 - 10,
    backgroundColor:'#fff',
    borderRadius: 5,
    marginLeft: '1.5%',
    marginRight: '0.5%',
    marginBottom: '2%'
  },
  blockimage: {
    resizeMode: 'cover',
    width: WIDTH / 2 - 10,
    height: WIDTH / 2,
    borderRadius: 3,
  },
  modal:{
    backgroundColor: '#46c433',
    width: WIDTH,
    height: HEIGHT
  },
  option:{
    alignItems: 'flex-start'
  },
  cityname:{
    margin: 20,
    fontSize: 18,
    fontFamily: 'mt-bold'
  }
});
