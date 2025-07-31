import { SYMBOLS } from '../lib/constants';

export default function SymbolSelector({ venue, symbol, setSymbol }: { venue: string, symbol: string, setSymbol: (s: string) => void }) {
  return (
    <select value={symbol} onChange={e => setSymbol(e.target.value)}>
      {SYMBOLS[venue].map(s => <option key={s} value={s}>{s}</option>)}
    </select>
  );
}
