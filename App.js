
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchLatestPriceData, getPriceForDate } from './src/api/currentPriceApi';

export default function App() {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPrice() {
      try {
        const { prices } = await fetchLatestPriceData();
        const now = new Date();
        const p = getPriceForDate(now, prices);
        setPrice(p);
      } catch (e) {
        setError(e.message);
      }
    }

    loadPrice();
  }, []);

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Virhe: {error}</Text>
      </View>
    );
  }

  if (price === null) {
    return (
      <View style={styles.container}>
        <Text>Ladataan hintaa...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.priceText}>
        Hinta nyt: {price} snt / kWh (sis. alv)
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  priceText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
  },
});
