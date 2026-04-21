import { useEffect, useState } from 'react';
import { Log } from '../types/log';
import { logService } from '../services/logService';

export const useLogsByBotId = (botId: string, limit: number = 20) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!botId) {
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await logService.getLogsByBotId(botId, limit);
        setLogs(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [botId, limit]);

  return { logs, loading, error };
};

export const useLogsByWorkerId = (workerId: string, limit: number = 20) => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!workerId) {
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await logService.getLogsByWorkerId(workerId, limit);
        setLogs(response.data || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [workerId, limit]);

  return { logs, loading, error };
};
