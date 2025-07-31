"use client";
import React from 'react';
import { useVenueState } from '../lib/useVenueState';
import { useOrderBook } from '../lib/useOrderBook';
import OrderbookTable from '../components/OrderbookTable';
import OrderSimulationForm from '../components/OrderSimulationForm';
import OrderImpactMetrics from '../components/OrderImpactMetrics';
import ImbalanceIndicator from '../components/ImbalanceIndicator';
import MarketDepthChart from '../components/MarketDepthChart';

export default function Home() {
  const { venue, setVenue, symbol, setSymbol } = useVenueState();
  const { orderbook, error } = useOrderBook(venue, symbol);
  const [result, setResult] = React.useState(null);
  const [simulatedOrder, setSimulatedOrder] = React.useState(null);

  function handleSimulate(order: any) {
    setSimulatedOrder(order);
    // Defensive: ensure orderbook is always an array
    const safeOrderbook = Array.isArray(orderbook) ? orderbook : [];
    if (!order || !safeOrderbook || !order.quantity) {
      setResult(null);
      return;
    }
    const qty = Number(order.quantity);
    const price = Number(order.price);
    let filled = 0;
    let bookSide;
    if (order.side?.toLowerCase() === 'buy') {
      bookSide = safeOrderbook.filter(e => e.side === 'ask').sort((a, b) => a.price - b.price);
    } else {
      bookSide = safeOrderbook.filter(e => e.side === 'bid').sort((a, b) => b.price - a.price);
    }
    let remaining = qty;
    let weightedSum = 0;
    let bestPrice = bookSide.length > 0 ? bookSide[0].price : 0;
    let delayMs = 0;
    if (order.timing === 'immediate') {
      delayMs = 0;
    } else if (typeof order.timing === 'string' && order.timing.endsWith('s')) {
      delayMs = parseInt(order.timing.replace('s', '')) * 1000;
    } else {
      delayMs = parseInt(order.timing) * 1000;
    }
    setTimeout(() => {
      for (let i = 0; i < bookSide.length && remaining > 0; i++) {
        const level = bookSide[i];
        const take = Math.min(level.quantity, remaining);
        filled += take;
        weightedSum += take * level.price;
        remaining -= take;
      }
      const fillPct = (filled / qty) * 100;
      const avgFillPrice = filled > 0 ? weightedSum / filled : 0;
      let marketImpact = 0;
      let slippage = 0;
      if (order.side?.toLowerCase() === 'buy') {
        marketImpact = avgFillPrice - bestPrice;
        slippage = avgFillPrice - (order.orderType === 'Limit' ? price : bestPrice);
      } else {
        marketImpact = bestPrice - avgFillPrice;
        slippage = (order.orderType === 'Limit' ? price : bestPrice) - avgFillPrice;
      }
      setResult({
        fill: fillPct.toFixed(2),
        impact: marketImpact.toFixed(4),
        slippage: slippage.toFixed(4),
        timeToFill: (delayMs / 1000).toFixed(2) + 's',
      });
    }, delayMs);
  }

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto', padding: 16 }}>
      <h1 style={{ textAlign: 'center', marginBottom: 24 }}>Real-Time Orderbook Viewer</h1>
      <div className="orderbook-panels" style={{ display: 'flex', flexWrap: 'wrap', gap: 16, justifyContent: 'center' }}>
        {['OKX', 'Bybit', 'Deribit'].map(v => (
          <div key={v} style={{ minWidth: 320 }}>
            <OrderbookTable venue={v} orderbook={orderbook} simulatedOrder={venue === v ? simulatedOrder : null} />
            <MarketDepthChart orderbook={orderbook} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, marginTop: 24, justifyContent: 'center' }}>
        <OrderSimulationForm venue={venue} symbol={symbol} setVenue={setVenue} setSymbol={setSymbol} onSimulate={handleSimulate} />
        <OrderImpactMetrics result={result} />
      </div>
      <ImbalanceIndicator orderbook={orderbook} />
    </div>
  );
}