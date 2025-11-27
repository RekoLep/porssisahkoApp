// NotificationForm.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Keyboard,
} from 'react-native';

interface NotificationFormProps {
  onSubscriptionSuccess: () => void;
}

// KORJATTU OSOITE: Käytetään HTTP (ei HTTPS) ja Android-emulaattorin IP-osoitetta
// Jos käytät iOS-simulaattoria, vaihda 'http://localhost:8080'
// Jos käytät fyysistä puhelinta, vaihda 'http://TIETOKONEESI_IP:8080'
const NOTIFICATION_API_URL =
  'http://192.168.19.45:8080/api/subscriptions/subscribe';

export default function NotificationForm({
  onSubscriptionSuccess,
}: NotificationFormProps) {
// ... (Muut osat säilyvät ennallaan)
  const [email, setEmail] = useState('');
  const [thresholdPrice, setThresholdPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    Keyboard.dismiss(); // Piilota näppäimistö

    // Yksinkertainen validointi
    if (!email || !thresholdPrice) {
      Alert.alert('Virhe', 'Täytäthän sekä sähköpostin että hintarajan.');
      return;
    }

    const priceValue = parseFloat(thresholdPrice.replace(',', '.')); // Muunna pilkku pisteeksi
    if (isNaN(priceValue) || priceValue <= 0) {
      Alert.alert('Virhe', 'Anna kelvollinen positiivinen hintaraja (snt/kWh).');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(NOTIFICATION_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          thresholdPrice: priceValue, // Spring Boot tarvitsee tämän double-muodossa
        }),
      });

      if (response.ok) {
        Alert.alert(
          'Onnistui!',
          `Tilaus luotu sähköpostiin ${email} hintarajalla ${priceValue} snt/kWh.`,
        );
        setEmail('');
        setThresholdPrice('');
        onSubscriptionSuccess(); // Kutsu yläkomponentin funktiota lomakkeen sulkemiseksi
      } else {
        // Käsittele virhevasteet backendistä
        const errorText = await response.text();
        Alert.alert(
          'Virhe tilauksessa',
          `Palvelinvirhe: ${response.status} - ${errorText}`,
        );
      }
    } catch (error) {
      console.error('Tilauksen lähetys epäonnistui:', error);
      Alert.alert(
        'Verkkovirhe',
        'Tilauksen lähetys epäonnistui. Tarkista verkko tai palvelimen osoite.',
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.formContainer}>
      
      <TextInput
        style={styles.input}
        placeholder="Sähköpostiosoite"
        placeholderTextColor="#999"
        keyboardType="email-address"
        autoCapitalize="none"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput
        style={styles.input}
        placeholder="Hintaraja (snt/kWh, esim. 8.5)"
        placeholderTextColor="#999"
        keyboardType="numeric"
        value={thresholdPrice}
        onChangeText={setThresholdPrice}
      />
      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleSubmit}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading ? 'Lähetetään...' : 'Tilaa ilmoitus'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    // ... (säilyvät tyylit)
  },
  formContainer: {
    width: '100%',
    padding: 15,
    borderRadius: 10,
    backgroundColor: '#333333',
    marginTop: 20,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    height: 40,
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderColor: '#444',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#00ff7f',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonDisabled: {
    backgroundColor: '#00cc66',
  },
  buttonText: {
    color: '#121212',
    fontWeight: 'bold',
    fontSize: 16,
  },
});