import React from 'react';
import { Worker } from '../../types/worker';
import { formatDate } from '../../utils/formatters';
import { LogList } from '../logs/LogList';
import { useLogsByWorkerId } from '../../hooks/useLogs';
import { LoadingSpinner, ErrorMessage } from '../common/LoadingSpinner';

interface WorkerDetailProps {
  worker: Worker;
  onBack: () => void;
}

export const WorkerDetail: React.FC<WorkerDetailProps> = ({ worker, onBack }) => {
  const workerLogsState = useLogsByWorkerId(worker.id, worker.bot);

  if (!worker) {
    return <ErrorMessage message="Worker not found" />;
  }

  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center text-primary hover:text-blue-700 mb-6 font-semibold"
      >
        ← Back to Bot
      </button>

      <div className="bg-white rounded-lg shadow-lg p-8 mb-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-dark">{worker.name}</h2>
            {worker.description && <p className="text-gray-600 text-lg mt-2">{worker.description}</p>}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-6 pt-6 border-t border-gray-200">
          <div>
            <p className="text-sm text-gray-600">Worker ID</p>
            <p className="font-mono text-xs text-gray-900 break-all">{worker.id}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Bot ID</p>
            <p className="font-mono text-xs text-gray-900 break-all">{worker.bot}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Created</p>
            <p className="text-gray-900">{formatDate(worker.created)}</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <h3 className="text-xl font-bold text-dark mb-4">Worker Logs</h3>
        <LogList
          logs={workerLogsState.logs}
          loading={workerLogsState.loading}
          error={workerLogsState.error}
          pagination={workerLogsState.pagination}
          onPageChange={workerLogsState.setOffset}
          onSearch={workerLogsState.setSearch}
        />
      </div>
    </div>
  );
};
