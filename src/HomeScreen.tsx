import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { fetchLatestPriceData } from './api/CurrentPriceApi';
import CountUp from './CountUp';
import DailyPriceChart from './DailyPriceChart'; 

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
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPrice() {
      try {
        const data: PriceDataResponse = await fetchLatestPriceData();

        const prices = data.prices;
        if (!Array.isArray(prices) || prices.length === 0) {
          throw new Error('Ei löytynyt hintatietoja');
        }

        const now = new Date();
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
      } finally {
        setLoading(false);
      }
    }

    loadPrice();
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text>Ladataan hintaa...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.error}>Virhe: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hinta nyt:</Text>
      <CountUp
        from={0}
        to={price ?? 0}
        duration={1500}
        separator=","
        style={styles.priceText}
      />
      <Text style={styles.unitText}>snt / kWh (sis. alv)</Text>

      
      <View style={styles.chartContainer}>
        <DailyPriceChart />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#121212',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  priceText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#00ff7f',
  },
  unitText: {
    fontSize: 16,
    color: '#cccccc',
    marginBottom: 16,
  },
  error: {
    color: '#ff6b6b',
    fontSize: 16,
  },
  chartContainer: {
    width: '100%',
    marginTop: 24,
  },
});
