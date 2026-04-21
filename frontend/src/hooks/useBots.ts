import { useEffect, useState } from 'react';
import { Bot } from '../types/bot';
import { botService } from '../services/botService';

export const useBots = (limit: number = 10, offset: number = 0) => {
  const [bots, setBots] = useState<Bot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const fetchBots = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await botService.getAllBots(limit, offset);
        setBots(response.data || []);
        setTotal(response.pagination?.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bots');
      } finally {
        setLoading(false);
      }
    };

    fetchBots();
  }, [limit, offset]);

  return { bots, loading, error, total };
};

export const useBotById = (id: string) => {
  const [bot, setBot] = useState<Bot | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    const fetchBot = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await botService.getBotById(id);
        setBot(response.data || null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch bot');
      } finally {
        setLoading(false);
      }
    };

    fetchBot();
  }, [id]);

  return { bot, loading, error };
};
