import { DEFAULT_SETTINGS } from '../api/shared/constants.js';
import { buildHistorySnapshot } from '../api/shared/history.js';
import { calculateSessionMetrics } from '../api/shared/metrics.js';

const now = new Date('2026-04-01T20:00:00-03:00').getTime();

// Presets calibrados para cada faixa de impacto (getImpactLevel em metrics.js)
// baixo < 18g | moderado 18–40g | alto 40–90g | crítico ≥ 90g
const MOCK_PRESETS = {
  baixo:    { sentMessages: 1,  receivedMessages: 1,  activityMs:    120_000, totalResponseMs:  60_000 },
  moderado: { sentMessages: 8,  receivedMessages: 7,  activityMs:    300_000, totalResponseMs: 180_000 },
  alto:     { sentMessages: 15, receivedMessages: 12, activityMs:    600_000, totalResponseMs: 480_000 },
  critico:  { sentMessages: 25, receivedMessages: 20, activityMs:  1_200_000, totalResponseMs: 900_000 },
};

function createSession({
  id,
  updatedAt,
  sentMessages,
  receivedMessages,
  activityMs,
  totalResponseMs,
}) {
  const base = {
    id,
    domain: 'chatgpt.com',
    startedAt: updatedAt - activityMs,
    updatedAt,
    sentMessages,
    receivedMessages,
    activityMs,
    totalResponseMs,
  };

  return {
    ...base,
    metrics: calculateSessionMetrics(base),
  };
}

function buildActiveSession(nivel = 'moderado') {
  const preset = MOCK_PRESETS[nivel] ?? MOCK_PRESETS.moderado;
  return {
    ...createSession({ id: 'mock-current', updatedAt: now, ...preset }),
    pendingAlert: false,
  };
}

const activeSession = buildActiveSession();

const storedSessions = [
  activeSession,
  createSession({
    id: 'mock-1',
    updatedAt: new Date('2026-04-01T11:20:00-03:00').getTime(),
    sentMessages: 4,
    receivedMessages: 4,
    activityMs: 480000,
    totalResponseMs: 42000,
  }),
  createSession({
    id: 'mock-2',
    updatedAt: new Date('2026-03-31T16:45:00-03:00').getTime(),
    sentMessages: 5,
    receivedMessages: 3,
    activityMs: 600000,
    totalResponseMs: 36000,
  }),
  createSession({
    id: 'mock-3',
    updatedAt: new Date('2026-03-29T13:10:00-03:00').getTime(),
    sentMessages: 8,
    receivedMessages: 6,
    activityMs: 1500000,
    totalResponseMs: 120000,
  }),
];

const sessionsById = Object.fromEntries(
  storedSessions.map((session) => [session.id, session]),
);

export function getMockPopupState(nivel) {
  const session = nivel ? buildActiveSession(nivel) : activeSession;
  const sessionsForHistory = { ...sessionsById, [session.id]: session };

  return {
    settings: DEFAULT_SETTINGS,
    activeSession: session,
    monitoringCurrentTab: true,
    activeTabUrl: 'https://chatgpt.com/c/mock-current',
    history: {
      today: buildHistorySnapshot(sessionsForHistory, 'today', now),
      sevenDays: buildHistorySnapshot(sessionsForHistory, 'sevenDays', now),
      thirtyDays: buildHistorySnapshot(sessionsForHistory, 'thirtyDays', now),
    },
  };
}
