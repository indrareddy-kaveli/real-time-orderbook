"use client";
import { useState } from 'react';

export function useVenueState() {
  const [venue, setVenue] = useState('OKX');
  const [symbol, setSymbol] = useState('BTC-USDT');
  return { venue, setVenue, symbol, setSymbol };
}
