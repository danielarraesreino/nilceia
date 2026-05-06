'use client';

import type { PostCategory } from '@/types';

const categories: PostCategory[] = [
  'Espiritualidade',
  'Cura Emocional',
  'Contos',
  'Justiça Social',
  'Poesia',
  'Reflexões',
];

interface CategoryFilterProps {
  selected: PostCategory | 'Todos';
  onChange: (category: PostCategory | 'Todos') => void;
}

export default function CategoryFilter({ selected, onChange }: CategoryFilterProps) {
  const all: Array<PostCategory | 'Todos'> = ['Todos', ...categories];

  return (
    <div
      role="group"
      aria-label="Filtrar por categoria"
      style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}
    >
      {all.map((cat) => {
        const isActive = selected === cat;
        return (
          <button
            key={cat}
            id={`filter-${cat.toLowerCase().replace(/\s/g, '-')}`}
            onClick={() => onChange(cat as PostCategory | 'Todos')}
            aria-pressed={isActive}
            style={{
              padding: '0.4rem 1rem',
              borderRadius: '99px',
              border: isActive ? '1.5px solid var(--accent-gold)' : '1.5px solid rgba(184,134,11,0.2)',
              backgroundColor: isActive ? 'var(--accent-gold)' : 'transparent',
              color: isActive ? '#fff' : 'var(--text-secondary)',
              fontSize: '0.8125rem',
              fontWeight: isActive ? 700 : 400,
              fontFamily: 'var(--font-body)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent-gold)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--accent-gold)';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(184,134,11,0.2)';
                (e.currentTarget as HTMLButtonElement).style.color = 'var(--text-secondary)';
              }
            }}
          >
            {cat}
          </button>
        );
      })}
    </div>
  );
}
