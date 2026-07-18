import type { ConfiguratorAnswers } from '@/types';

const examples = [
  'Ona ne zna gde idemo.',
  'Slavimo 30. rođendan.',
  'Želimo privatnost.',
  'Ne pijemo alkohol.',
  'Jedna osoba ne vozi.',
  'Potrebno nam je posebno iznenađenje.',
];

interface StepProps {
  answers: ConfiguratorAnswers;
  update: (patch: Partial<ConfiguratorAnswers>) => void;
}

export default function StepSpecialRequest({ answers, update }: StepProps) {
  return (
    <div>
      <h2 className="font-serif text-2xl text-ink sm:text-3xl">Imate li posebnu želju?</h2>
      <p className="mt-1.5 text-sm text-ink-soft">Ovo pomaže našem timu da uskladi baš vaš vikend. Nije obavezno.</p>

      <textarea
        value={answers.specialRequest}
        onChange={(e) => update({ specialRequest: e.target.value })}
        rows={5}
        placeholder="Napišite nam nešto o vašim planovima…"
        className="mt-5 w-full rounded-xl2 border border-ink/15 bg-warm-white p-4 text-ink"
      />

      <div className="mt-4 flex flex-wrap gap-2">
        {examples.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() =>
              update({
                specialRequest: answers.specialRequest ? `${answers.specialRequest} ${example}` : example,
              })
            }
            className="min-h-[36px] rounded-full border border-ink/15 bg-warm-white px-3 text-xs text-ink-soft hover:border-forest/40 hover:text-forest"
          >
            {example}
          </button>
        ))}
      </div>
    </div>
  );
}
