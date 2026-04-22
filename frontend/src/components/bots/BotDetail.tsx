import React from 'react';
import { Bot } from '../../types/bot';
import { formatDate, formatStatus, getStatusColor } from '../../utils/formatters';
import { Tabs } from '../common/Tabs';
import { WorkerList } from '../workers/WorkerList';
import { LogList } from '../logs/LogList';
import { useWorkersByBotId } from '../../hooks/useWorkers';
import { useLogsByBotId } from '../../hooks/useLogs';

interface BotDetailProps {
  bot: Bot;
  onBack: () => void;
  onWorkerClick?: (workerId: string) => void;
}

export const BotDetail: React.FC<BotDetailProps> = ({ bot, onBack, onWorkerClick }) => {
  const { workers, loading: workersLoading, error: workersError } = useWorkersByBotId(bot.id);
  const botLogsState = useLogsByBotId(bot.id);

  const tabs = [
    {
      label: `Workers (${workers.length})`,
      content: (
        <WorkerList
          workers={workers}
          loading={workersLoading}
          error={workersError}
          onWorkerClick={onWorkerClick}
        />
      ),
    },
    {
      label: 'Logs',
      content: (
        <LogList
          logs={botLogsState.logs}
          loading={botLogsState.loading}
          error={botLogsState.error}
          pagination={botLogsState.pagination}
          onPageChange={botLogsState.setOffset}
          onSearch={botLogsState.setSearch}
        />
      ),
    },
  ];

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-primary hover:text-blue-700 mb-6 font-semibold"
      >
        ← Back to Bots
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-dark">{bot.name}</h2>
            {bot.description && <p className="text-gray-600 text-lg mt-2">{bot.description}</p>}
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(bot.status)}`}>
            {formatStatus(bot.status)}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Bot ID</p>
            <p className="font-mono text-xs text-gray-900 break-all">{bot.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="text-gray-900">{formatDate(bot.created)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <Tabs tabs={tabs} />
      </div>
    </div>
  );
};
