
const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v2/latest-prices.json';

interface ElectricityPrice {
  startDate: string;
  endDate: string;
  price: number;
}

interface LatestPriceResponse {
  prices: ElectricityPrice[];
}

export async function fetchLatestPriceData(): Promise<LatestPriceResponse> {
  const response = await fetch(LATEST_PRICES_ENDPOINT);
  if (!response.ok) {
    throw new Error('Virhe haettaessa tietoja API:sta');
  }

  const data: LatestPriceResponse = await response.json();
  return data;
}
