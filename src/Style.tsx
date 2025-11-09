import { StyleSheet, TextStyle, ViewStyle } from 'react-native';

interface Styles {
  container: ViewStyle;
  priceText: TextStyle;
  error: TextStyle;
  title: TextStyle;
  unitText: TextStyle;
  text: TextStyle;
  chartContainer: ViewStyle; 
}

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingTop: 230,
    paddingRight: 100,
    backgroundColor: '#fff', 
  },
  priceText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#000', 
  },
  error: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  title: {
    fontSize: 18,
    marginBottom: 4,
    color: '#333',
  },
  unitText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 12,
  },
  text: {
    fontSize: 15,
    color: '#333',
  },
  chartContainer: {
    width: '100%',
    marginTop: 24,
    paddingHorizontal: 16,
  },
});

export default styles;
