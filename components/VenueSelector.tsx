import { VENUES } from '../lib/constants';

export default function VenueSelector({ venue, setVenue }: { venue: string, setVenue: (v: string) => void }) {
  return (
    <select value={venue} onChange={e => setVenue(e.target.value)}>
      {VENUES.map(v => <option key={v} value={v}>{v}</option>)}
    </select>
  );
}
