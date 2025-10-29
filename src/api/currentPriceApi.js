

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v2/latest-prices.json';


export async function fetchLatestPriceData() {
  const response = await fetch(LATEST_PRICES_ENDPOINT);
  if (!response.ok) {
    throw new Error('Virhe haettaessa tietoja API:sta');
  }
  return response.json();
}
