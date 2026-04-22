import { useEffect, useState } from 'react';
import { Worker } from '../types/worker';
import { workerService } from '../services/workerService';

export const useWorkersByBotId = (botId: string) => {
  const [workers, setWorkers] = useState<Worker[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!botId) {
      setLoading(false);
      return;
    }

    const fetchWorkers = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await workerService.getWorkersByBotId(botId);
        setWorkers(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch workers');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkers();
  }, [botId]);

  return { workers, loading, error };
};

export const useWorkerById = (workerId: string, botId: string) => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workerId || !botId) {
      setLoading(false);
      return;
    }

    const fetchWorker = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await workerService.getWorkerById(workerId, botId);
        setWorker(response.data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch worker');
      } finally {
        setLoading(false);
      }
    };

    fetchWorker();
  }, [workerId, botId]);

  return { worker, loading, error };
};
