export default function OrderbookTable({ venue, orderbook, simulatedOrder }: { venue: string, orderbook: any[], simulatedOrder?: any }) {
  // Defensive: ensure orderbook is always an array
  const safeOrderbook = Array.isArray(orderbook) ? orderbook : [];
  if (!safeOrderbook.length) {
    return (
      <div>
        <h3>{venue}</h3>
        <div style={{ color: '#aaa', padding: 16 }}>Waiting for data...</div>
      </div>
    );
  }
  return (
    <div>
      <h3>{venue}</h3>
      <table>
        <thead>
          <tr>
            <th>Price</th>
            <th>Side</th>
            <th>Quantity</th>
          </tr>
        </thead>
        <tbody>
          {safeOrderbook.map((entry, i) => {
            const isSimulated = simulatedOrder &&
              entry.price === Number(simulatedOrder.price) &&
              entry.side?.toLowerCase() === simulatedOrder.side?.toLowerCase();
            return (
              <tr key={i} style={isSimulated ? { background: '#ffe066', fontWeight: 600 } : {}}>
                <td>
                  {isSimulated ? <span style={{
                    background: '#f39c12',
                    color: '#fff',
                    borderRadius: 4,
                    padding: '2px 6px',
                    marginRight: 4,
                    fontSize: 12,
                    fontWeight: 700
                  }}>Sim</span> : null}
                  <span style={{ color: entry.side === 'bid' ? 'green' : 'red' }}>{entry.price}</span>
                </td>
                <td>{entry.side}</td>
                <td>{entry.quantity}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}