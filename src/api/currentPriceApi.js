

const LATEST_PRICES_ENDPOINT = 'https://api.porssisahko.net/v2/latest-prices.json';


export async function fetchLatestPriceData() {
  const response = await fetch(LATEST_PRICES_ENDPOINT);
  if (!response.ok) {
    throw new Error('Virhe haettaessa tietoja API:sta');
  }
  return response.json();
}

/**
 
 * @param {Date} date
 * @param {Array} prices 
 * @returns {number} 
 */
export function getPriceForDate(date, prices) {
  const matchingPriceEntry = prices.find(
    (price) =>
      new Date(price.startDate) <= date && new Date(price.endDate) > date
  );

  if (!matchingPriceEntry) {
    throw new Error('Price for the requested date is missing');
  }

  return matchingPriceEntry.price;
}
