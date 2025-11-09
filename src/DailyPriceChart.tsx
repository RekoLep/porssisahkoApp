import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions, ActivityIndicator, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';

//Noni, sen verran monimutkasta koodia, että lisäilen tänne mahdollisimman paljon kommentteja

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v2/latest-prices.json';

interface PriceEntry {
  price: number;
  startDate: string;
  endDate: string;
}

const DailyPriceChart: React.FC = () => {
  const [prices, setPrices] = useState<PriceEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPrices = async () => {
      try {
        const response = await fetch(LATEST_PRICES_ENDPOINT);
        const data = await response.json();

        // Muodosta tänään Suomen aikaa
        const now = new Date();
        const todayLocal = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const todayUtc = new Date(todayLocal.getTime() - todayLocal.getTimezoneOffset() * 60000);
        const todayStr = todayUtc.toISOString().slice(0, 10);

        // Suodata vain tämän päivän hinnat
        const filtered = data.prices.filter((p: PriceEntry) => p.startDate.startsWith(todayStr));

        // Järjestä aikajärjestykseen varmuuden vuoksi
        filtered.sort(
          (a: PriceEntry, b: PriceEntry) =>
            new Date(a.startDate).getTime() - new Date(b.startDate).getTime()
        );

        setPrices(filtered);
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

  // Muodosta labelit Suomen ajassa
  const labels = prices.map((p) => {
    const date = new Date(p.startDate);
    const localDate = new Date(date.getTime() + date.getTimezoneOffset() * -60000);
    const hours = String(localDate.getHours()).padStart(2, '0');
    const minutes = String(localDate.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
  });

  const dataValues = prices.map((p) => p.price);

  const screenWidth = Dimensions.get('window').width;
  const chartWidth = screenWidth * 3; // hieman leveämpi, jotta scrollaus toimii hyvin

  // Harvenna näkyviä label-tekstejä (näytetään esim. 1/8)
  const visibleLabels = labels.map((lbl, i) => (i % 8 === 0 ? lbl : ''));

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
        Päivän sähkönhinnat snt/kWh (sis. alv)
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
            style: { borderRadius: 16 },
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
