import { useEffect, useState } from 'react';
import { Log } from '../types/log';
import { logService } from '../services/logService';

export interface LogsState {
  logs: Log[];
  loading: boolean;
  error: string | null;
  pagination: {
    limit: number;
    offset: number;
    total: number;
  };
  setOffset: (offset: number) => void;
  setSearch: (search: string) => void;
}

export const useLogsByBotId = (botId: string, limit: number = 20): LogsState => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!botId) {
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await logService.getLogsByBotId(botId, limit, offset, search);
        setLogs(response.data || []);
        if (response.pagination) {
          setTotal(response.pagination.total);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [botId, limit, offset, search]);

  return {
    logs,
    loading,
    error,
    pagination: { limit, offset, total },
    setOffset,
    setSearch,
  };
};

export const useLogsByWorkerId = (workerId: string, botId: string, limit: number = 20): LogsState => {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const [search, setSearch] = useState('');
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!workerId || !botId) {
      setLoading(false);
      return;
    }

    const fetchLogs = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await logService.getLogsByWorkerId(workerId, botId, limit, offset, search);
        setLogs(response.data || []);
        if (response.pagination) {
          setTotal(response.pagination.total);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch logs');
      } finally {
        setLoading(false);
      }
    };

    fetchLogs();
  }, [workerId, botId, limit, offset, search]);

  return {
    logs,
    loading,
    error,
    pagination: { limit, offset, total },
    setOffset,
    setSearch,
  };
};
