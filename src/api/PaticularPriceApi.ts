
const PATICULAR_PRICE_ENDPOINT = 'https://api.porssisahko.net/v2/price.json';

export interface PriceEntry {
  startDate: string;
  endDate: string;
  price: number;
}

export function getPriceForDate(date: Date, prices: PriceEntry[]): number {
  const matchingPriceEntry = prices.find(
    (price) =>
      new Date(price.startDate) <= date && new Date(price.endDate) > date
  );

  if (!matchingPriceEntry) {
    throw new Error('Virhe haettaessa tietoja API:sta');
  }

  return matchingPriceEntry.price;
}
