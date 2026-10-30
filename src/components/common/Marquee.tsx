import { Asterisk } from 'lucide-react';

const phrases = [
  'Less ordinary. More you.',
  'Considered layers for the everyday',
  'Small batch · No restocks',
  'Designed in the studio, worn on the street',
];

export function Marquee() {
  return (
    <div className="overflow-hidden border-y border-ink bg-ink py-4 text-bone-light" aria-label="Brand statements">
      <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <div
            key={copy}
            aria-hidden={copy === 1}
            className="flex items-center gap-8 pr-8 text-[10px] font-semibold uppercase tracking-[0.22em]"
          >
            {phrases.map((phrase) => (
              <span key={phrase} className="flex items-center gap-8 whitespace-nowrap">
                {phrase}
                <Asterisk className="size-3 text-acid" aria-hidden="true" />
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
