import React, { useState } from 'react';

const VENUES = ['OKX', 'Bybit', 'Deribit'];

export default function OrderSimulationForm({ venue, symbol, setVenue, setSymbol, onSimulate }: any) {
  const [orderType, setOrderType] = useState('Market');
  const [side, setSide] = useState('Buy');
  const [price, setPrice] = useState('');
  const [quantity, setQuantity] = useState('');
  const [timing, setTiming] = useState('immediate');
  const [errors, setErrors] = useState<any>({});

  function validate() {
    const errs: any = {};
    if (!venue) errs.venue = 'Venue required';
    if (!symbol) errs.symbol = 'Symbol required';
    if (!orderType) errs.orderType = 'Order type required';
    if (!side) errs.side = 'Side required';
    if (orderType === 'Limit' && (!price || isNaN(Number(price)))) errs.price = 'Valid price required for limit orders';
    if (!quantity || isNaN(Number(quantity)) || Number(quantity) <= 0) errs.quantity = 'Valid quantity required';
    if (!timing) errs.timing = 'Timing required';
    return errs;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      onSimulate({ venue, symbol, orderType, side, price, quantity, timing });
    }
  }

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 280, padding: 16, border: '1px solid #eee', borderRadius: 8 }}>
      <label>
        Venue
        <select value={venue} onChange={e => setVenue(e.target.value)}>
          <option value="">Select venue</option>
          {VENUES.map((v: string) => <option key={v} value={v}>{v}</option>)}
        </select>
        {errors.venue && <span style={{ color: 'red', fontSize: 12 }}>{errors.venue}</span>}
      </label>
      <label>
        Symbol
        <input type="text" value={symbol} onChange={e => setSymbol(e.target.value)} placeholder="e.g. BTC-USD" />
        {errors.symbol && <span style={{ color: 'red', fontSize: 12 }}>{errors.symbol}</span>}
      </label>
      <label>
        Order Type
        <select value={orderType} onChange={e => setOrderType(e.target.value)}>
          <option>Market</option>
          <option>Limit</option>
        </select>
        {errors.orderType && <span style={{ color: 'red', fontSize: 12 }}>{errors.orderType}</span>}
      </label>
      <label>
        Side
        <select value={side} onChange={e => setSide(e.target.value)}>
          <option>Buy</option>
          <option>Sell</option>
        </select>
        {errors.side && <span style={{ color: 'red', fontSize: 12 }}>{errors.side}</span>}
      </label>
      {orderType === 'Limit' && (
        <label>
          Price
          <input type="number" value={price} onChange={e => setPrice(e.target.value)} min="0" step="any" />
          {errors.price && <span style={{ color: 'red', fontSize: 12 }}>{errors.price}</span>}
        </label>
      )}
      <label>
        Quantity
        <input type="number" value={quantity} onChange={e => setQuantity(e.target.value)} min="0" step="any" />
        {errors.quantity && <span style={{ color: 'red', fontSize: 12 }}>{errors.quantity}</span>}
      </label>
      <label>
        Timing
        <div style={{ display: 'flex', gap: 8 }}>
          <label><input type="radio" name="timing" value="immediate" checked={timing === 'immediate'} onChange={e => setTiming(e.target.value)} /> Immediate</label>
          <label><input type="radio" name="timing" value="5s" checked={timing === '5s'} onChange={e => setTiming(e.target.value)} /> 5s</label>
          <label><input type="radio" name="timing" value="10s" checked={timing === '10s'} onChange={e => setTiming(e.target.value)} /> 10s</label>
          <label><input type="radio" name="timing" value="30s" checked={timing === '30s'} onChange={e => setTiming(e.target.value)} /> 30s</label>
        </div>
        {errors.timing && <span style={{ color: 'red', fontSize: 12 }}>{errors.timing}</span>}
      </label>
      <button type="submit" style={{ marginTop: 8, padding: '8px 0', fontWeight: 600 }}>Simulate</button>
    </form>
  );
}