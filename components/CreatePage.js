import { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Dimensions, Image, Alert, Platform, Modal, KeyboardAvoidingView, ActivityIndicator } from 'react-native';
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons';
import firebase from 'firebase/compat/app';
import * as ImagePicker from 'expo-image-picker';
import { TownSelect } from './subcomponents/TownSelect';
import 'firebase/compat/database'
import 'firebase/compat/storage'
import { ScrollView } from 'react-native-gesture-handler';
import * as Location from 'expo-location';

const HEIGHT = Dimensions.get('window').height
const WIDTH = Dimensions.get('window').width



export const CreatePage = ({navigation}) => {

    const [location, setLocation] = useState(null);
    const [errorMsg, setErrorMsg] = useState(null);
    const key = (Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15))

    useEffect(() => {
      (async () => {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
          setErrorMsg('Permission to access location was denied');
          return;
        }
      })();
    }, []);
    useEffect(() => {
      (async () => {
        if (Platform.OS !== 'web') {
          const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
          if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
          }
        }
      })();
    }, []);

    const [Town, setTown] = useState('Оберіть область');
    const [full, setFull] = useState('')
    const [uploading, setUploading] = useState(false)
    const [isModalVisible, setisModalVisible] = useState(false)

    const changeModalVisibility = (bool) => {
        setisModalVisible(bool)
      }

      const setData = (option) => {
        setTown(option)
      }

    const uploadImage = async () => {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
              resolve(xhr.response);
            };
            xhr.onerror = function () {
              reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", image, true);
            xhr.send(null);
          });
          
          // Create a ref in Firebase (I'm using my user's ID)
          const ref = firebase.storage().ref().child(Date.now().toString());
          
          // Upload blob to Firebase
          const snapshot = await ref.put(blob, { contentType: "image/png" });
          
          // Create a download URL
          const remoteURL = await snapshot.ref.getDownloadURL();
          
          // Return the URL
          return remoteURL;
    }

    const [image, setImage] = useState(null);
    const [imageUrl, setImageUrl] = useState(null)

    const UploadData = async () => {
      console.log(location)
        setUploading(true)
        console.log(location)
        uploadImage().then((url) => {
        const db = firebase.firestore();
        db.collection("posts")
            .doc(key)
            .set({
              full: full,
              city: Town,
              image: url,
              latitude: location['coords']['latitude'],
              longitude: location['coords']['longitude'],
              date: firebase.firestore.Timestamp.now(),
        })
        setUploading(false)
        navigation.goBack()
        })
    }

    const pickImage = async () => {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setImage(result.uri);
        await Location.getCurrentPositionAsync({}).then((location) => {
          setLocation(location)
        });
      }
      else {
      }  
    };


    const getCity = async () => {
        let regionName = await Location.reverseGeocodeAsync({
            latitude: location['coords']['latitude'],
            longitude: location['coords']['longitude'],
          });
        
        return regionName[0]['region']
    }

    // Dataset
    const ReadyData = () => {
        if (Town == 'Оберіть область') {
          Alert.alert('Необхідно обрати область');
        } else if (!image) {
          Alert.alert('Необхідно завантажити зображення');
        } else if(Town == 'Автовизначення') {
          getCity().then((region) => {
              setTown(region)
          })
        } 
        else{
          UploadData()
      }
    }

  return (
    <>
    {uploading ? 
        <View style={styles.uploading}>
          <Text style={styles.wait}>Зачекайте...</Text>
          <ActivityIndicator size={100} color={'#46c433'}/>
        </View> :
      <KeyboardAvoidingView style={{flex: 1}}>
        
        <ScrollView>
        {! image ? 
        <TouchableOpacity style={styles.pickedImage} onPress={pickImage}>
            <Text style={{fontFamily: 'mt', fontSize: 16, textAlign: 'center'}}>Натисніть для завантаження зображення</Text>
        </TouchableOpacity>
        :
        <TouchableOpacity style={styles.pickedImage} onPress={pickImage}>
            <Image source={{uri: image}} style={styles.chosenImage}/>
        </TouchableOpacity>}
            <TouchableOpacity style={styles.choosetowndiv} onPress={() => changeModalVisibility(true)}>
                <View style={{flexDirection: 'row'}}>
                  {Town.length <= 20 ?
                  <Text style={styles.choosetowns}>{Town}</Text>
                  : 
                  <Text style={styles.choosetownl}>{Town}</Text>}
                   <View style={styles.imgIconContainer}>
                        <MaterialIcons name="location-city" size={35} color="black" />
                   </View>
                </View>
           </TouchableOpacity>
           <Text style={styles.hint}>При виборі варіанта Автовизначення треба натиснути кнопку "Готово" двічі</Text>
        <View style={styles.searchbtn}>
            <TextInput multiline 
                value={full}
                placeholder='Додаткова інформація' 
                backgroundColor={'#fff'}
                width={'93%'}
                fontFamily={'mt-bold'}
                padding={'3%'}
                fontSize={20}
                maxLength={200}
                borderWidth={1}
                borderRadius={10}
                borderColor={'#46c433'}
                onChangeText={(full) => setFull(full)}/>
        </View>
        </ScrollView>
        <TouchableOpacity style={styles.floatingButton} onPress={ReadyData}>
          <FontAwesome5 name='check' size={32} color='#fff' />
        </TouchableOpacity>
        <Modal
        animationType="fade"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => changeModalVisibility(false)}>
            <TownSelect
              changeModalVisibility={changeModalVisibility}
              setData={setData}
            />
        </Modal>  
      </KeyboardAvoidingView>}
    </>
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
    fontFamily: 'mt-bold',
    fontSize: 25,
    backgroundColor: '#46c433',
    textAlign: 'center',
    padding: '6%',
    paddingHorizontal: '20%',
    borderRadius: 15
  },
  categview:{
    alignItems: 'center',
    marginHorizontal: '10%'
  },
  pickedImage:{
    width: WIDTH / 1.3,
    height: WIDTH / 1.3,
    justifyContent: 'center',
    backgroundColor: '#9696963a',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: '3%',
    marginBottom: '3%',
    borderRadius: 20
  },
  chosenImage:{
    width: WIDTH / 1.3,
    height: WIDTH/ 1.3,
    borderRadius: 20
  },
  searchbtn:{
    flexDirection: 'row',
    justifyContent: 'center'
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
  choosetowns:{
    color: '#000',
    backgroundColor: '#46c433',
    fontFamily: 'mt-bold',
    fontSize: 15,
    paddingVertical: '5%',
    paddingHorizontal: '15%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  choosetownl:{
    color: '#000',
    backgroundColor: '#46c433',
    fontFamily: 'mt-bold',
    fontSize: 15,
    paddingVertical: '5%',
    paddingHorizontal: '10%',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10
  },
  choosetowndiv:{
    alignItems: 'center',
    marginBottom: '3%',
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
  hint:{
    fontFamily: 'mt',
    fontSize: 15,
    color: '#8c8c8c',
    textAlign: 'center',
    marginBottom: '3%'
  },
  uploading:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: WIDTH,
    height: HEIGHT
  },
  wait:{
    color: '#46c433',
    textAlign: "center",
    fontSize: 20,
    fontFamily: 'mt-med',
  }
});
