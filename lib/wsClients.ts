// WebSocket clients for OKX, Bybit, Deribit
export async function fetchOrderbook(venue: string, symbol: string): Promise<any[]> {
  if (venue === 'OKX') {
    const instId = symbol.replace('-', '-'); // OKX uses e.g. BTC-USDT
    const res = await fetch(`https://www.okx.com/api/v5/market/books?instId=${instId}`);
    const data = await res.json();
    // Format bids/asks to your table format (price, ask, quantity, side)
    return [
      ...data.data[0].bids.slice(0, 15).map(([price, quantity]) => ({
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        ask: parseFloat(quantity),
        side: 'bid'
      })),
      ...data.data[0].asks.slice(0, 15).map(([price, quantity]) => ({
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        ask: parseFloat(quantity),
        side: 'ask'
      }))
    ];
  }
  if (venue === 'Bybit') {
    const symbolBybit = symbol.replace('-', '');
    const res = await fetch(`https://api.bybit.com/v5/market/orderbook?category=linear&symbol=${symbolBybit}`);
    const data = await res.json();
    return [
      ...data.result.b.map(([price, quantity]) => ({
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        ask: parseFloat(quantity),
        side: 'bid'
      })),
      ...data.result.a.map(([price, quantity]) => ({
        price: parseFloat(price),
        quantity: parseFloat(quantity),
        ask: parseFloat(quantity),
        side: 'ask'
      }))
    ].slice(0, 15);
  }
  if (venue === 'Deribit') {
    const instName = symbol.replace('-', '-PERPETUAL');
    const res = await fetch(`https://www.deribit.com/api/v2/public/get_order_book?instrument_name=${instName}`);
    const data = await res.json();
    return [
      ...data.result.bids.slice(0, 15).map(bid => ({
        price: bid.price,
        quantity: bid.amount,
        ask: bid.amount,
        side: 'bid'
      })),
      ...data.result.asks.slice(0, 15).map(ask => ({
        price: ask.price,
        quantity: ask.amount,
        ask: ask.amount,
        side: 'ask'
      }))
    ];
  }
  return [];
}
