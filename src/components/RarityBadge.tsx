import { Star } from 'lucide-react';
import type { RarityId } from '../types';

interface Props {
  rarityId: RarityId;
  label: string;
  size?: 'sm' | 'md';
}

export function RarityBadge({ rarityId, label, size = 'md' }: Props) {
  const iconSize = size === 'sm' ? 9 : 10;
  const fontSize = size === 'sm' ? 9 : 10;
  const padding = size === 'sm' ? '2px 7px' : '3px 9px';

  return (
    <span
      className={`badge badge-${rarityId}`}
      style={{ fontSize, padding }}
    >
      <Star size={iconSize} strokeWidth={2} fill="currentColor" />
      {label}
    </span>
  );
}
