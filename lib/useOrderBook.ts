import { useEffect, useState, useRef } from 'react';

type OrderbookEntry = { price: number, quantity: number, side: 'bid' | 'ask' };

function normalizeOKX(data: any): OrderbookEntry[] {
  const bids = (data?.bids ?? []).slice(0, 15).map(([price, qty]: [string, string]) => ({
    price: Number(price),
    quantity: Number(qty),
    side: 'bid' as const,
  }));
  const asks = (data?.asks ?? []).slice(0, 15).map(([price, qty]: [string, string]) => ({
    price: Number(price),
    quantity: Number(qty),
    side: 'ask' as const,
  }));
  return [...bids, ...asks];
}

function normalizeBybit(data: any): OrderbookEntry[] {
  const bids = (data?.b ?? []).slice(0, 15).map(([price, qty]: [string, string]) => ({
    price: Number(price),
    quantity: Number(qty),
    side: 'bid' as const,
  }));
  const asks = (data?.a ?? []).slice(0, 15).map(([price, qty]: [string, string]) => ({
    price: Number(price),
    quantity: Number(qty),
    side: 'ask' as const,
  }));
  return [...bids, ...asks];
}

function normalizeDeribit(data: any): OrderbookEntry[] {
  const bids = (data?.bids ?? []).slice(0, 15).map((entry: any) => ({
    price: entry[0],
    quantity: entry[1],
    side: 'bid' as const,
  }));
  const asks = (data?.asks ?? []).slice(0, 15).map((entry: any) => ({
    price: entry[0],
    quantity: entry[1],
    side: 'ask' as const,
  }));
  return [...bids, ...asks];
}

export function useOrderBook(venue: string, symbol: string) {
  const [orderbook, setOrderbook] = useState<OrderbookEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    if (!venue || !symbol) return;
    let ws: WebSocket | null = null;
    let closed = false;

    // Cleanup previous socket
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }

    function handleError(e: any) {
      setError('Connection lost. Showing last known data.');
    }

    // --- OKX ---
    if (venue === 'OKX') {
      const okxSymbol = symbol.includes('-') ? symbol : `${symbol}-USDT`;
      ws = new WebSocket('wss://ws.okx.com:8443/ws/v5/public');
      ws.onopen = () => {
        ws!.send(JSON.stringify({
          op: 'subscribe',
          args: [{ channel: 'books5', instId: okxSymbol }]
        }));
      };
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const data = msg.data?.[0];
        if (msg.arg && data) {
          setOrderbook(normalizeOKX(data));
          setError(null);
        }
      };
      ws.onerror = handleError;
      ws.onclose = handleError;
    }
    // --- Bybit ---
    else if (venue === 'Bybit') {
      const bybitSymbol = symbol.replace('-', '') + 'USDT';
      ws = new WebSocket('wss://stream.bybit.com/v5/public/spot');
      ws.onopen = () => {
        ws!.send(JSON.stringify({
          op: 'subscribe',
          args: [`orderbook.50.${bybitSymbol}`]
        }));
      };
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const data = msg.data;
        if (msg.topic && data) {
          setOrderbook(normalizeBybit(data));
          setError(null);
        }
      };
      ws.onerror = handleError;
      ws.onclose = handleError;
    }
    // --- Deribit ---
    else if (venue === 'Deribit') {
      const deribitSymbol = symbol.toLowerCase() + '-perpetual';
      ws = new WebSocket('wss://www.deribit.com/ws/api/v2/');
      ws.onopen = () => {
        ws!.send(JSON.stringify({
          method: 'public/subscribe',
          params: { channels: [`book.${deribitSymbol}.none.20.100ms`] },
          id: 42
        }));
      };
      ws.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        const data = msg.params?.data;
        if (data) {
          setOrderbook(normalizeDeribit(data));
          setError(null);
        }
      };
      ws.onerror = handleError;
      ws.onclose = handleError;
    }

    wsRef.current = ws;

    return () => {
      closed = true;
      ws && ws.close();
    };
  }, [venue, symbol]);

  return { orderbook, error };
}