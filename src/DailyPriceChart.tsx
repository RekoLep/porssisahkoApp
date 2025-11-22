import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v2/latest-prices.json';

interface PriceEntry {
  price: number;
  startDate: string;
  endDate: string;
}

const DailyPriceChart: React.FC = () => {
  const [prices, setPrices] = useState<{ time: string; price: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(LATEST_PRICES_ENDPOINT);
        const data = await response.json();

        const now = new Date();

        // Päivän alku/loppu LOCAL ajassa (EI UTC)
        const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);

        // Käydään läpi kaikki 192 varttia ja muunnetaan jokainen LOCAL-ajaksi
        const todayEntries: { time: string; price: number }[] = [];

        data.prices.forEach((p: PriceEntry) => {
          const d = new Date(p.startDate);    // UTC → local automaattisesti
          if (d >= todayStart && d <= todayEnd) {
            const hh = String(d.getHours()).padStart(2, '0');
            const mm = String(d.getMinutes()).padStart(2, '0');
            todayEntries.push({
              time: `${hh}:${mm}`,
              price: p.price,
            });
          }
        });

        // Lajitellaan varmuuden vuoksi
        todayEntries.sort((a, b) => a.time.localeCompare(b.time));

        setPrices(todayEntries);
      } catch (err) {
        console.error('Virhe hintojen haussa', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrices();
  }, []);

  if (loading) {
    return (
      <View style={{ alignItems: 'center', justifyContent: 'center', height: 200 }}>
        <ActivityIndicator size="large" color="#2196f3" />
        <Text>Ladataan sähkön hintoja...</Text>
      </View>
    );
  }

  if (prices.length === 0) {
    return <Text>Ei hintatietoja tälle päivälle.</Text>;
  }

  const labels = prices.map((p) => p.time);
  const dataValues = prices.map((p) => p.price);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * 3;

  const visibleLabels = labels.map((lbl) => {
    const [h, m] = lbl.split(':').map(Number);
    return m === 0 ? lbl : '';
  });


  return (
    <View>
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          textAlign: 'center',
          marginBottom: 8,
          color: '#fff',
        }}
      >
        Päivän sähkönhinnat snt/kWh (15 min)
      </Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <LineChart
          data={{
            labels: visibleLabels,
            datasets: [{ data: dataValues }],
          }}
          width={chartWidth}
          height={250}
          yAxisSuffix=" snt"
          chartConfig={{
            backgroundColor: '#1e1e1e',
            backgroundGradientFrom: '#1e1e1e',
            backgroundGradientTo: '#3e3e3e',
            decimalPlaces: 2,
            color: (opacity = 1) => `rgba(0, 255, 127, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            propsForDots: { r: '2' },
          }}
          bezier
          style={{
            marginVertical: 8,
            borderRadius: 16,
          }}
        />
      </ScrollView>
    </View>
  );
};

export default DailyPriceChart;
