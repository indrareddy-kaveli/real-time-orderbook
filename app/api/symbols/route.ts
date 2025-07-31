// API route for fetching symbols
import { NextResponse } from 'next/server';
import { SYMBOLS } from '../../../lib/constants';

export async function GET() {
  // Example: symbols grouped by venue
  const symbolsByVenue = {
    OKX: ['BTC-USDT', 'ETH-USDT', 'SOL-USDT', 'ADA-USDT'],
    Bybit: ['BTC-USDT', 'ETH-USDT', 'XRP-USDT', 'DOGE-USDT'],
    Deribit: ['BTC-USD', 'ETH-USD']
  };
  return NextResponse.json({ symbols: symbolsByVenue });
}

