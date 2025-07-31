export type OrderbookEntry = {
  price: number;
  size: number;
  side: 'bid' | 'ask';
};

export type Venue = 'OKX' | 'Bybit' | 'Deribit';

export type SimulationOrder = {
  symbol: string;
  size: number;
  venue: Venue;
};

export type SimulationResult = {
  fill: number;
  slippage: number;
};
