import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, Pressable, Dimensions, Image, Modal } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import { useState } from 'react';
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

const Track = ({navigation, route}) => {

    const {latitude, longitude, full, image, city} = route.params
    const [visible, setVisible] = useState(false)
    const LATITUDE_DELTA = 0.0922
    const LONGITUDE_DELTA = LATITUDE_DELTA * (WIDTH / HEIGHT)

    const response = [
        {
            id: '1',
            coordinates: {
                latitude: latitude,
                longitude: longitude,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA
            },
            title: 'Місце',
            description: full,
            // icon: require('../assets/markers/car-right.png')
        }
    ]

    return (
    <>
      <MapView
      provider={PROVIDER_GOOGLE}
      showsUserLocation={true}
      rotateEnabled={false}
      style={mapstyle.map}
      loadingEnabled={true}
      zoomEnabled={true}
      region={{
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: LATITUDE_DELTA,
        longitudeDelta: LONGITUDE_DELTA
      }}
      onPress={(event) => { setVisible(false) }}
      >
        {response.map(marker => (
            <MapView.Marker
                key={marker.id}
                identifier={marker.id}
                coordinate={marker.coordinates}
                onPress={(event) => {
                    setVisible(true)
                }}
            >
            </MapView.Marker>
        ))}
      </MapView>
      <Modal
        animationType={'fade'}
        transparent={true}
        visible={visible}>
            <View style={mapstyle.ModalBack}>
                <Pressable onPress={(event) => {setVisible(false)}} style={{flex: 1}}></Pressable>
                <View style={mapstyle.card}>    
                    <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                        <Image style={mapstyle.img} source={{uri: image}}/>
                        <View style={mapstyle.inform}>
                            <Text style={mapstyle.info}>Область: {'\n'}{city}</Text>
                            <Text style={mapstyle.info}>Широта: {'\n'}{latitude}</Text>
                            <Text style={mapstyle.info}>Довгота: {'\n'}{longitude}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
    </>
    );
}

const mapstyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map:{
    width: WIDTH,
    height: HEIGHT
  },
  card:{
    position: 'absolute',
    width: WIDTH - 20,
    backgroundColor: '#fff',
    alignSelf: 'center',
    height: '20%',
    bottom: '2%',
    borderRadius: 15,
    elevation: 5
  },
  ModalBack:{
    flex: 1,
    justifyContent: 'flex-end'
  },
  img:{
    resizeMode: 'stretch',
    height: HEIGHT * 0.15,
    width: WIDTH * 0.40,
    borderRadius: 5,
    marginTop: '5%',
    marginLeft: '5%'
  },
  inform:{
    flexDirection: 'column',
    marginTop: '4%',
  },
  info:{
    fontFamily: 'mt',
    fontSize: 15,
    marginRight: '5%'
  }
});

export {Track};