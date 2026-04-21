import React from 'react';
import { Bot } from '../../types/bot';
import { BotCard } from './BotCard';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common/LoadingSpinner';

interface BotListProps {
  bots: Bot[];
  loading: boolean;
  error: string | null;
  onBotClick: (id: string) => void;
}

export const BotList: React.FC<BotListProps> = ({ bots, loading, error, onBotClick }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (bots.length === 0) return <EmptyState message="No bots found" />;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {bots.map((bot) => (
        <BotCard key={bot.id} bot={bot} onClick={onBotClick} />
      ))}
    </div>
  );
};
