import React from 'react';
import { StyleSheet, Text, View, ViewStyle, TextStyle } from 'react-native';

export default function SettingScreen(){
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Määrittele asetuksiasi täältä.</Text>
    </View>
  );
}

interface Styles {
  container: ViewStyle;
  text: TextStyle;
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 15,
  },
});
