import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextStyle, ViewStyle } from 'react-native';
import { fetchLatestPriceData } from './api/CurrentPriceApi';
import CountUp from './CountUp';

// Tyypit datalle, jonka API palauttaa
interface PriceItem {
  startDate: string;
  endDate: string;
  price: number;
}

interface PriceDataResponse {
  prices: PriceItem[];
}

export default function HomeScreen() {
  const [price, setPrice] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadPrice() {
      try {
        const data: PriceDataResponse = await fetchLatestPriceData();

        const prices = data.prices;

        if (!Array.isArray(prices) || prices.length === 0) {
          throw new Error('Ei löytynyt hintatietoja');
        }

        const now = new Date();

        // Etsi se hinta, jonka aikaväli kattaa nykyhetken
        const current = prices.find((p) => {
          const start = new Date(p.startDate);
          const end = new Date(p.endDate);
          return now >= start && now < end;
        });

        const selected = current ?? prices[0];
        setPrice(selected.price);
      } catch (e: unknown) {
        const message =
          e instanceof Error ? e.message : 'Tuntematon virhe hinnan haussa';
        setError(message);
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

interface Styles {
  container: ViewStyle;
  priceText: TextStyle;
  error: TextStyle;
  title: TextStyle;
  unitText: TextStyle;
}

const styles = StyleSheet.create<Styles>({
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
  title: {
    fontSize: 18,
    marginBottom: 4,
  },
  unitText: {
    fontSize: 14,
    color: '#555',
  },
});
