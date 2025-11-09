import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';
import styles from './Style';

export default function SettingScreen(){
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Määrittele asetuksiasi täältä.</Text>
    </View>
  );
}


