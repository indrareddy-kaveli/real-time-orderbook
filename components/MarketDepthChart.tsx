import { useEffect, useState, useRef } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function MarketDepthChart({ orderbook }: { orderbook: any[] }) {
  const safeOrderbook = Array.isArray(orderbook) ? orderbook : [];
  const bids = safeOrderbook.filter(e => e.side === 'bid').sort((a, b) => b.price - a.price);
  const asks = safeOrderbook.filter(e => e.side === 'ask').sort((a, b) => a.price - b.price);

  let bidSum = 0, askSum = 0;
  const bidData = bids.map(b => ({ price: b.price, size: bidSum += b.quantity }));
  const askData = asks.map(a => ({ price: a.price, size: askSum += a.quantity }));

  // Throttle updates to once every 1s using setInterval and refs
  const [chartData, setChartData] = useState({ bidData, askData });
  const latestBidData = useRef(bidData);
  const latestAskData = useRef(askData);

  // Always keep refs up to date with latest data
  useEffect(() => {
    latestBidData.current = bidData;
    latestAskData.current = askData;
  }, [bidData, askData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setChartData({
        bidData: latestBidData.current,
        askData: latestAskData.current,
      });
    }, 1000); // update every 1s
    return () => clearInterval(interval);
  }, []);

  return (
    <ResponsiveContainer width="100%" height={200}>
      <AreaChart>
        <XAxis dataKey="price" type="number" domain={['auto', 'auto']} />
        <YAxis dataKey="size" />
        <Tooltip />
        <Legend />
        <Area
          type="stepAfter"
          dataKey="size"
          data={chartData.bidData}
          name="Bids"
          stroke="#4caf50"
          fill="#c8e6c9"
          isAnimationActive={false}
        />
        <Area
          type="stepAfter"
          dataKey="size"
          data={chartData.askData}
          name="Asks"
          stroke="#f44336"
          fill="#ffcdd2"
          isAnimationActive={false}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}