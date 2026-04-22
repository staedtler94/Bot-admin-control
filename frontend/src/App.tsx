import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { BotList } from './components/bots/BotList';
import { BotDetail } from './components/bots/BotDetail';
import { WorkerDetail } from './components/workers/WorkerDetail';
import { Pagination } from './components/common/Pagination';
import { useBots, useBotById } from './hooks/useBots';
import { useWorkerById } from './hooks/useWorkers';
import { PAGE_SIZE } from './utils/constants';

export const App: React.FC = () => {
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);

  const { bots, loading, error, total } = useBots(PAGE_SIZE, offset);
  const { bot: selectedBot, loading: selectedBotLoading } = useBotById(selectedBotId || '');
  const { worker: selectedWorker, loading: selectedWorkerLoading } = useWorkerById(selectedWorkerId || '');

  // Worker detail view
  if (selectedWorkerId && selectedWorker) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <WorkerDetail
            worker={selectedWorker}
            onBack={() => setSelectedWorkerId(null)}
          />
        </div>
      </>
    );
  }

  // Bot detail view
  if (selectedBotId && selectedBot) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BotDetail
            bot={selectedBot}
            onBack={() => setSelectedBotId(null)}
            onWorkerClick={(workerId) => setSelectedWorkerId(workerId)}
          />
        </div>
      </>
    );
  }

  // Bot list view (default)
  return (
    <>
      <Header />
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-dark mb-6">All Bots</h2>
          <BotList bots={bots} loading={loading} error={error} onBotClick={setSelectedBotId} />
          <Pagination limit={PAGE_SIZE} offset={offset} total={total} onPageChange={setOffset} />
        </div>
      </div>
    </>
  );
};

export default App;
