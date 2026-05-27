import { css } from 'glamor';
import { useEffect, useMemo, useState } from 'react';
import FeedbackBox from './components/feedback-box/index.jsx';
import AlertView from './views/alert-view/index.jsx';
import DetailsView from './views/details-view/index.jsx';
import EmptyState from './views/empty-state/index.jsx';
import HistoryView from './views/history-view/index.jsx';
import SettingsView from './views/settings-view/index.jsx';
import SummaryView from './views/summary-view/index.jsx';
import {
  clearCollectedHistory,
  dismissAlert,
  exportCollectedData,
  fetchPopupState,
  updateSettings,
} from './api.js';
import { theme } from './modules/theme.js';

const styles = {
  pagina: css({
    height: '600px',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    color: theme.cores.ink,
    borderRadius: theme.bordas.cartao,
  }),
  shell: css({
    flex: 1,
    minHeight: 0,
    width: '100%',
    margin: '0px auto',
    display: 'flex',
    flexDirection: 'column',
  }),
  stack: css({
    flex: 1,
    minHeight: 0,
    display: 'flex',
    flexDirection: 'column',
  }),
};

function getHistoryFallback() {
  return {
    today: { sessions: [] },
    sevenDays: { sessions: [] },
    thirtyDays: { sessions: [] },
  };
}

function getStatusFallback(lastSyncAt) {
  return {
    monitoringCurrentTab: false,
    activeTabUrl: '',
    activeSessionId: '',
    lastSyncAt,
  };
}

function PopupApp() {
  const params = new URLSearchParams(window.location.search);
  const [view, setView] = useState(params.get('view') || 'summary');
  const [historyRange, setHistoryRange] = useState('today');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [popupState, setPopupState] = useState(null);
  const [lastSyncAt, setLastSyncAt] = useState(null);

  async function loadPopupState() {
    const state = await fetchPopupState();

    setPopupState(state);
    setLastSyncAt(Date.now());
    setError('');

    if (state.activeSession?.pendingAlert) {
      setView('alert');
    }

    return state;
  }

  useEffect(() => {
    let active = true;

    loadPopupState()
      .catch((caughtError) => {
        if (active) {
          setError(caughtError.message);
        }
      })
      .finally(() => {
        if (active) {
          setLoading(false);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  const activeSession = popupState?.activeSession || null;
  const history = useMemo(
    () => popupState?.history || getHistoryFallback(),
    [popupState],
  );
  const status = useMemo(
    () =>
      popupState
        ? {
            monitoringCurrentTab: popupState.monitoringCurrentTab ?? false,
            activeTabUrl: popupState.activeTabUrl ?? '',
            activeSessionId: popupState.activeSession?.id ?? '',
            lastSyncAt,
          }
        : getStatusFallback(lastSyncAt),
    [popupState, lastSyncAt],
  );

  async function handleUpdateSettings(patch) {
    const response = await updateSettings(patch);

    setPopupState((current) =>
      current
        ? {
            ...current,
            settings: {
              ...current.settings,
              ...response.settings,
              monitoring: {
                ...current.settings.monitoring,
                ...response.settings.monitoring,
                domains: {
                  ...current.settings.monitoring.domains,
                  ...response.settings.monitoring?.domains,
                },
              },
              alerts: {
                ...current.settings.alerts,
                ...response.settings.alerts,
              },
            },
          }
        : current,
    );
  }

  async function handleRefresh() {
    try {
      await loadPopupState();
    } catch (caughtError) {
      setError(caughtError.message);
    }
  }

  async function handleDismissAlert() {
    if (activeSession?.id) {
      await dismissAlert(activeSession.id);
    }

    setPopupState((current) =>
      current && current.activeSession
        ? {
            ...current,
            activeSession: {
              ...current.activeSession,
              pendingAlert: false,
            },
          }
        : current,
    );
    setView('summary');
  }

  async function handleExportData() {
    const exported = await exportCollectedData();
    const file = new Blob([JSON.stringify(exported, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');

    link.href = url;
    link.download = `ia-sustentavel-export-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();

    URL.revokeObjectURL(url);
  }

  async function handleClearHistory() {
    const confirmed = window.confirm(
      'Deseja limpar todo o histórico coletado pela extensão? Esta ação não poderá ser desfeita.',
    );

    if (!confirmed) {
      return;
    }

    const response = await clearCollectedHistory();

    setPopupState((current) =>
      current
        ? {
            ...current,
            activeSession: null,
            history: response.history,
          }
        : current,
    );
    setHistoryRange('today');
    setView('summary');
  }

  function renderContent() {
    if (loading) {
      return <FeedbackBox title="Carregando métricas da extensão..." />;
    }

    if (error) {
      return (
        <FeedbackBox
          title="Não foi possível carregar o popup"
          message={error}
          isError
        />
      );
    }

    if (!activeSession) {
      return <EmptyState onOpenSettings={() => setView('settings')} />;
    }

    if (view === 'details') {
      return (
        <DetailsView
          session={activeSession}
          onBack={() => setView('summary')}
        />
      );
    }

    if (view === 'history') {
      return (
        <HistoryView
          history={history}
          selectedRange={historyRange}
          onRangeChange={setHistoryRange}
          onBack={() => setView('summary')}
          onExportData={handleExportData}
          onClearHistory={handleClearHistory}
        />
      );
    }

    if (view === 'settings') {
      return (
        <SettingsView
          settings={popupState.settings}
          status={status}
          onBack={() => setView('summary')}
          onRefresh={handleRefresh}
          onUpdateSettings={handleUpdateSettings}
        />
      );
    }

    if (view === 'alert') {
      return (
        <AlertView session={activeSession} onDismiss={handleDismissAlert} />
      );
    }

    return (
      <SummaryView
        session={activeSession}
        isMonitoring={popupState.monitoringCurrentTab}
        lastSyncAt={lastSyncAt}
        onRefresh={handleRefresh}
        onOpenSettings={() => setView('settings')}
        onOpenDetails={() => setView('details')}
        onOpenHistory={() => setView('history')}
      />
    );
  }

  return (
    <main className={styles.pagina}>
      <div className={styles.shell}>
        <div className={styles.stack}>{renderContent()}</div>
      </div>
    </main>
  );
}

export default PopupApp;
