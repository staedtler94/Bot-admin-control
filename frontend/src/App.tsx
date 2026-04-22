import React, { useState } from 'react';
import { Header } from './components/common/Header';
import { BotList } from './components/bots/BotList';
import { BotDetail } from './components/bots/BotDetail';
import { WorkerDetail } from './components/workers/WorkerDetail';
import { LogDetail } from './components/logs/LogDetail';
import { Pagination } from './components/common/Pagination';
import { LoadingSpinner, ErrorMessage } from './components/common/LoadingSpinner';
import { useBots, useBotById } from './hooks/useBots';
import { useWorkerById } from './hooks/useWorkers';
import { Log } from './types/log';
import { PAGE_SIZE } from './utils/constants';

export const App: React.FC = () => {
  const [selectedBotId, setSelectedBotId] = useState<string | null>(null);
  const [selectedWorkerId, setSelectedWorkerId] = useState<string | null>(null);
  const [selectedLog, setSelectedLog] = useState<Log | null>(null);
  const [offset, setOffset] = useState(0);

  const { bots, loading, error, total } = useBots(PAGE_SIZE, offset);
  const { bot: selectedBot, loading: selectedBotLoading, error: selectedBotError } = useBotById(selectedBotId || '');
  const { worker: selectedWorker, loading: selectedWorkerLoading, error: selectedWorkerError } = useWorkerById(selectedWorkerId || '', selectedBotId || '');

  // Log detail view (rendered on top of whichever context the user came from)
  if (selectedLog) {
    const backLabel = selectedWorkerId ? 'Back to Worker' : 'Back to Bot';
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          <LogDetail
            log={selectedLog}
            onBack={() => setSelectedLog(null)}
            backLabel={backLabel}
          />
        </div>
      </>
    );
  }

  // Worker detail view
  if (selectedWorkerId) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {selectedWorkerLoading ? (
            <LoadingSpinner />
          ) : selectedWorkerError ? (
            <ErrorMessage message={selectedWorkerError} />
          ) : selectedWorker ? (
            <WorkerDetail
              worker={selectedWorker}
              onBack={() => setSelectedWorkerId(null)}
              onLogClick={setSelectedLog}
            />
          ) : (
            <ErrorMessage message="Worker not found" />
          )}
        </div>
      </>
    );
  }

  // Bot detail view
  if (selectedBotId) {
    return (
      <>
        <Header />
        <div className="max-w-7xl mx-auto px-4 py-8">
          {selectedBotLoading ? (
            <LoadingSpinner />
          ) : selectedBotError ? (
            <ErrorMessage message={selectedBotError} />
          ) : selectedBot ? (
            <BotDetail
              bot={selectedBot}
              onBack={() => setSelectedBotId(null)}
              onWorkerClick={(workerId) => setSelectedWorkerId(workerId)}
              onLogClick={setSelectedLog}
            />
          ) : (
            <ErrorMessage message="Bot not found" />
          )}
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
