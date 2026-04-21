import React from 'react';
import { Bot } from '../../types/bot';
import { formatDate, formatStatus, getStatusColor } from '../../utils/formatters';

interface BotCardProps {
  bot: Bot;
  onClick: (id: string) => void;
}

export const BotCard: React.FC<BotCardProps> = ({ bot, onClick }) => (
  <div
    onClick={() => onClick(bot.id)}
    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg hover:cursor-pointer transition-shadow border-l-4 border-primary"
  >
    <div>
      <h3 className="text-lg font-bold text-dark">{bot.name}</h3>
      {bot.description && <p className="text-gray-600 text-sm mt-1">{bot.description}</p>}
      <div className="flex items-center justify-between mt-4">
        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(bot.status)}`}>
          {formatStatus(bot.status)}
        </span>
        <span className="text-xs text-gray-500">{formatDate(bot.created)}</span>
      </div>
    </div>
  </div>
);
