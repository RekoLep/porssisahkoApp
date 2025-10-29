

const PATICULAR_PRICE_ENDPOINT = 'https://api.porssisahko.net/v2/price.json';

export function getPriceForDate(date, prices) {
  const matchingPriceEntry = prices.find(
    (price) =>
      new Date(price.startDate) <= date && new Date(price.endDate) > date
  );

  if (!matchingPriceEntry) {
    throw new Error('Virhe haettaessa tietoja API:sta');
  }

  return matchingPriceEntry.price;
}