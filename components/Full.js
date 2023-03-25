import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { TouchableOpacity, FlatList, Dimensions, Image } from 'react-native';

const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height

export const Full = ({navigation, route}) => {
    const {image, full, city, date, latitude, longitude} = route.params

    return (
      <View>
          <Image style={styles.image} source={{uri: image}}/>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.city}>Область</Text>
                <Text style={styles.city}>{city}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.city}>Широта</Text>
                <Text style={styles.city}>{latitude}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                <Text style={styles.city}>Довгота</Text>
                <Text style={styles.city}>{longitude}</Text>
          </View>
          <Text style={styles.info}>Додаткова інформація</Text>
          {full ? <Text style={styles.infotext}>{full}</Text> : <Text style={styles.noinfo}>Немає</Text>}
          <TouchableOpacity onPress={() => navigation.navigate('Track', {
            latitude: latitude,
            longitude: longitude,
            full: full,
            image: image.toString(),
            city: city
          })}>
              <Text style={styles.build}>Показати на карті</Text>
          </TouchableOpacity>
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
  image:{
    width: WIDTH,
    height: WIDTH * 0.76,
  },
  city:{
    fontFamily: 'mt',
    fontSize: 15,
    marginHorizontal: '5%',
    marginVertical: '3%'
  },
  build:{
    fontFamily: 'mt-med',
    fontSize: 20,
    marginHorizontal: '5%',
    marginVertical: '3%',
    textAlign: 'center',
    backgroundColor: '#46c433',
    borderRadius: 20,
    padding: '5%'
  },
  info:{
    fontFamily: 'mt',
    fontSize: 15,
    textAlign: 'center',
    marginBottom: '3%'
  },
  infotext:{
    fontFamily: 'mt',
    fontSize: 15,
    marginHorizontal: '5%',
  },
  noinfo:{
    fontFamily: 'mt',
    fontSize: 15,
    marginHorizontal: '5%',
    color: '#8c8c8c'
  }
});
