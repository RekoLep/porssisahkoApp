import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { fetchLatestPriceData } from './api/CurrentPriceApi';
import CountUp from './CountUp';

export default function HomeScreen() {
  const [price, setPrice] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function loadPrice() {
      try {
        const data = await fetchLatestPriceData();

        const prices = data.prices;

        if (!Array.isArray(prices) || prices.length === 0) {
          throw new Error("Ei löytynyt hintatietoja");
        }

        // Katsoo nykyisen ajan tosiaan
        const now = new Date();

        // Etsi se hinta-objekti, jonka aikaväli kattaa nyt
        const current = prices.find(p => {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          return now >= start && now < end;
        });

        // Jos ei löytynyt, ota esim. ensimmäinen
        const selected = current ?? prices[0];
        setPrice(selected.price);
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
      <Text style={styles.title}>Hinta nyt:</Text>
      <CountUp
        from={0}
        to={price}
        duration={1500} 
        separator=","    
        style={styles.priceText}
      />
      <Text style={styles.unitText}>snt / kWh (sis. alv)</Text>
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