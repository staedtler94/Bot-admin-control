import React from 'react';
import { Worker } from '../../types/worker';
import { formatDate } from '../../utils/formatters';
import { LoadingSpinner, ErrorMessage, EmptyState } from '../common/LoadingSpinner';

interface WorkerListProps {
  workers: Worker[];
  loading: boolean;
  error: string | null;
  onWorkerClick?: (id: string) => void;
}

export const WorkerList: React.FC<WorkerListProps> = ({ workers, loading, error, onWorkerClick }) => {
  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;
  if (workers.length === 0) return <EmptyState message="No workers found" />;

  return (
    <div className="space-y-2">
      {workers.map((worker) => (
        <div
          key={worker.id}
          onClick={() => onWorkerClick?.(worker.id)}
          className="bg-white rounded-lg p-4 border border-gray-200 hover:border-primary hover:cursor-pointer transition-all"
        >
          <div className="flex justify-between items-start">
            <div>
              <h4 className="font-semibold text-dark">{worker.name}</h4>
              {worker.description && <p className="text-sm text-gray-600">{worker.description}</p>}
            </div>
            <span className="text-xs text-gray-500">{formatDate(worker.created)}</span>
          </div>
        </div>
      ))}
    </div>
  );
};
