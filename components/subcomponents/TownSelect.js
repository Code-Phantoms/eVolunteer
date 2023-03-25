import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions, ScrollView } from 'react-native';

const OPTIONS = ['Автовизначення', 
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
  'Чернігівська область',
]
const WIDTH = Dimensions.get('window').width
const HEIGHT = Dimensions.get('window').height
const TownSelect = (props) => {
  const onPressItem = (option) => {
    props.changeModalVisibility(false);
    props.setData(option);
    console.log(option) // Вывод в консоль выбраного города
  }

  const option = OPTIONS.map((item, index) => {
    return(
      <TouchableOpacity style={styles.option} key={index} onPress={() => onPressItem(item)}>
        <Text style={styles.text}>
          {item}
        </Text>
      </TouchableOpacity>
    )
  })

  return(
    <TouchableOpacity
    onPress={() => props.changeModalVisibility(false)}
    style={styles.container}
    >
      <View style={styles.modal}>
        <ScrollView>
          {option}
        </ScrollView>
      </View>

    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container:{
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modal:{
    backgroundColor: '#46c433',
    width: WIDTH,
    height: HEIGHT
  },
  option:{
    alignItems: 'flex-start'
  },
  text:{
    margin: 20,
    fontSize: 18,
    fontFamily: 'mt-bold'
  }
});

export {TownSelect}