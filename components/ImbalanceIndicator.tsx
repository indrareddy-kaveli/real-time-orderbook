export default function ImbalanceIndicator({ orderbook }: { orderbook: any[] }) {
  // Defensive: ensure orderbook is always an array
  const safeOrderbook = Array.isArray(orderbook) ? orderbook : [];
  const bidSum = safeOrderbook.filter(e => e.side === 'bid').reduce((a, b) => a + b.quantity, 0);
  const askSum = safeOrderbook.filter(e => e.side === 'ask').reduce((a, b) => a + b.quantity, 0);
  const total = bidSum + askSum;
  const imbalance = total === 0 ? '0.00' : ((bidSum - askSum) / total * 100).toFixed(2);
  return <div style={{ marginTop: 12 }}>Orderbook Imbalance: <b>{imbalance} %</b></div>;
}