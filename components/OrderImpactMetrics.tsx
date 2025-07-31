export default function OrderImpactMetrics({ result }: { result: any }) {
  if (!result) return <div><h3>Order Impact Panel</h3><div>No simulation yet.</div></div>;
  const warning = Math.abs(Number(result.slippage)) > 1 ? "⚠️ High slippage risk!" : null;
  return (
    <div style={{ border: '1px solid #eee', borderRadius: 8, padding: 16, minWidth: 220 }}>
      <h3>Order Impact Panel</h3>
      <div>Estimated Fill Percentage <b>{result?.fill ?? '0'} %</b></div>
      <div>Market Impact <b>{result?.impact ?? '0'}</b></div>
      <div>Slippage <b>{result?.slippage ?? '0'}</b></div>
      <div>Time to Fill <b>{result?.timeToFill ?? 'N/A'}</b></div>
      {warning && <div style={{ color: 'red', fontWeight: 600 }}>{warning}</div>}
    </div>
  );
}