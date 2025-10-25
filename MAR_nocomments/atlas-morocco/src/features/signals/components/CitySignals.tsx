// Server wrapper that passes coordinates/FX quote to the client panel.
import SignalsPanel from './SignalsPanel';

type Props = {
  lat: number;
  lon: number;
  fxBase?: string;
  fxQuote?: string;
};

export default function CitySignals({ lat, lon, fxBase = 'USD', fxQuote = 'MAD' }: Props) {
  return (
    <div className="mt-6">
      <SignalsPanel lat={lat} lon={lon} />
    </div>
  );
}