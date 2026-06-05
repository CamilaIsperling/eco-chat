import {
  CHATGPT_HOSTS,
  DEFAULT_SETTINGS,
  STORAGE_KEYS,
} from '../shared/constants.js';
import { buildHistorySnapshot } from '../shared/history.js';
import {
  calculateSessionMetrics,
  getBadgeText,
  getImpactMeta,
} from '../shared/metrics.js';

function mergeSettings(storedSettings = {}) {
  return {
    ...DEFAULT_SETTINGS,
    ...storedSettings,
    monitoring: {
      ...DEFAULT_SETTINGS.monitoring,
      ...storedSettings.monitoring,
      domains: {
        ...DEFAULT_SETTINGS.monitoring.domains,
        ...storedSettings.monitoring?.domains,
      },
    },
    alerts: {
      ...DEFAULT_SETTINGS.alerts,
      ...storedSettings.alerts,
    },
  };
}

async function ensureDefaults() {
  const stored = await chrome.storage.local.get(Object.values(STORAGE_KEYS));
  const payload = {};

  if (!stored[STORAGE_KEYS.settings]) {
    payload[STORAGE_KEYS.settings] = DEFAULT_SETTINGS;
  }

  if (!stored[STORAGE_KEYS.sessions]) {
    payload[STORAGE_KEYS.sessions] = {};
  }

  if (!stored[STORAGE_KEYS.activeByTab]) {
    payload[STORAGE_KEYS.activeByTab] = {};
  }

  if (Object.keys(payload).length > 0) {
    await chrome.storage.local.set(payload);
  }
}

async function getStore() {
  const data = await chrome.storage.local.get(Object.values(STORAGE_KEYS));

  return {
    settings: mergeSettings(data[STORAGE_KEYS.settings]),
    sessions: data[STORAGE_KEYS.sessions] || {},
    activeByTab: data[STORAGE_KEYS.activeByTab] || {},
  };
}

async function saveStore(store) {
  await chrome.storage.local.set({
    [STORAGE_KEYS.settings]: store.settings,
    [STORAGE_KEYS.sessions]: store.sessions,
    [STORAGE_KEYS.activeByTab]: store.activeByTab,
  });
}

function isChatGPTUrl(url) {
  try {
    const parsed = new URL(url);
    return CHATGPT_HOSTS.some((host) => parsed.hostname.includes(host));
  } catch {
    return false;
  }
}

function getLevelWeight(level) {
  const levels = ['baixo', 'moderado', 'alto', 'critico'];
  return levels.indexOf(level);
}

async function updateBadgeForTab(tabId, session, settings) {
  if (!tabId) {
    return;
  }

  if (!settings.alerts.showBadge || !session?.metrics) {
    await chrome.action.setBadgeText({ tabId, text: '' });
    return;
  }

  await chrome.action.setBadgeText({
    tabId,
    text: getBadgeText(session, settings.primaryUnit),
  });
  await chrome.action.setBadgeBackgroundColor({
    tabId,
    color: getImpactMeta(session.metrics.impactLevel).badgeHex,
  });
}

async function maybeSendImpactAlert(tabId, session, settings, previousSession) {
  if (!settings.alerts.showImpactAlerts) {
    return false;
  }

  const minimumLevel = settings.alerts.minimumLevel || 'alto';
  const currentWeight = getLevelWeight(session.metrics.impactLevel);
  const minimumWeight = getLevelWeight(minimumLevel);
  const previousWeight = getLevelWeight(
    previousSession?.lastAlertLevelNotified || 'baixo',
  );

  if (currentWeight < minimumWeight || currentWeight <= previousWeight) {
    return false;
  }

  try {
    await chrome.tabs.sendMessage(tabId, {
      type: 'impact:alert',
      payload: {
        impactLevel: session.metrics.impactLevel,
        co2eGrams: session.metrics.co2eGrams,
        energyKWh: session.metrics.energyKWh,
      },
    });
  } catch {
    return false;
  }

  return true;
}

async function handleSessionUpdate(payload, sender) {
  const tabId = sender.tab?.id ?? payload.tabId;

  if (!tabId) {
    return { persisted: false };
  }

  const store = await getStore();
  const sessionId = payload.sessionId;
  const previousSession = store.sessions[sessionId] || {};
  const mergedSession = {
    ...previousSession,
    ...payload,
    id: sessionId,
    tabId,
    title: 'ChatGPT',
    domain: payload.domain || 'chatgpt.com',
    updatedAt: payload.updatedAt || Date.now(),
  };

  mergedSession.metrics = calculateSessionMetrics(mergedSession);
  mergedSession.impactLevel = mergedSession.metrics.impactLevel;

  const alertDispatched = await maybeSendImpactAlert(
    tabId,
    mergedSession,
    store.settings,
    previousSession,
  );

  if (alertDispatched) {
    mergedSession.pendingAlert = true;
    mergedSession.lastAlertLevelNotified = mergedSession.metrics.impactLevel;
  }

  store.sessions[sessionId] = mergedSession;
  store.activeByTab[tabId] = sessionId;
  await saveStore(store);
  await updateBadgeForTab(tabId, mergedSession, store.settings);

  return { persisted: true, session: mergedSession };
}

async function getPopupState() {
  const store = await getStore();
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  const activeSessionId = tab?.id ? store.activeByTab[tab.id] : null;
  const sessionsList = Object.values(store.sessions);
  const activeSession =
    (activeSessionId ? store.sessions[activeSessionId] : null) ||
    sessionsList.sort(
      (left, right) =>
        Number(right.updatedAt || 0) - Number(left.updatedAt || 0),
    )[0] ||
    null;

  // Mantém o badge consistente com a sessão que o popup vai exibir agora.
  if (tab?.id && activeSessionId) {
    await updateBadgeForTab(
      tab.id,
      store.sessions[activeSessionId],
      store.settings,
    );
  }

  return {
    settings: store.settings,
    activeSession,
    monitoringCurrentTab: Boolean(tab?.url && isChatGPTUrl(tab.url)),
    activeTabUrl: tab?.url || null,
    history: {
      today: buildHistorySnapshot(store.sessions, 'today'),
      sevenDays: buildHistorySnapshot(store.sessions, 'sevenDays'),
      thirtyDays: buildHistorySnapshot(store.sessions, 'thirtyDays'),
    },
  };
}

async function handleSettingsUpdate(patch) {
  const store = await getStore();
  store.settings = mergeSettings({
    ...store.settings,
    ...patch,
    monitoring: {
      ...store.settings.monitoring,
      ...patch.monitoring,
      domains: {
        ...store.settings.monitoring.domains,
        ...patch.monitoring?.domains,
      },
    },
    alerts: {
      ...store.settings.alerts,
      ...patch.alerts,
    },
  });

  await saveStore(store);

  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab?.id) {
    const activeSessionId = store.activeByTab[tab.id];
    await updateBadgeForTab(
      tab.id,
      store.sessions[activeSessionId],
      store.settings,
    );
  }

  return { settings: store.settings };
}

async function handleDismissAlert(sessionId) {
  const store = await getStore();
  const session = store.sessions[sessionId];

  if (!session) {
    return { session: null };
  }

  session.pendingAlert = false;
  store.sessions[sessionId] = session;
  await saveStore(store);
  return { session };
}

async function handleExportData() {
  const store = await getStore();

  return {
    exportedAt: Date.now(),
    settings: store.settings,
    sessions: Object.values(store.sessions).sort(
      (left, right) =>
        Number(right.updatedAt || 0) - Number(left.updatedAt || 0),
    ),
  };
}

async function handleClearHistory() {
  const store = await getStore();
  store.sessions = {};
  store.activeByTab = {};
  await saveStore(store);

  const tabs = await chrome.tabs.query({});
  await Promise.all(
    tabs
      .filter((tab) => typeof tab.id === 'number')
      .map((tab) => chrome.action.setBadgeText({ tabId: tab.id, text: '' })),
  );

  return {
    history: {
      today: buildHistorySnapshot({}, 'today'),
      sevenDays: buildHistorySnapshot({}, 'sevenDays'),
      thirtyDays: buildHistorySnapshot({}, 'thirtyDays'),
    },
  };
}

chrome.runtime.onInstalled.addListener(() => {
  void ensureDefaults();
});

chrome.runtime.onStartup.addListener(() => {
  void ensureDefaults();
});

chrome.tabs.onActivated.addListener(async ({ tabId }) => {
  const store = await getStore();
  const sessionId = store.activeByTab[tabId];
  await updateBadgeForTab(tabId, store.sessions[sessionId], store.settings);
});

chrome.tabs.onRemoved.addListener(async (tabId) => {
  const store = await getStore();
  if (store.activeByTab[tabId]) {
    delete store.activeByTab[tabId];
    await saveStore(store);
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  const handlers = {
    'session:update': () => handleSessionUpdate(message.payload, sender),
    'popup:get-state': () => getPopupState(),
    'settings:update': () => handleSettingsUpdate(message.payload),
    'alert:dismiss': () => handleDismissAlert(message.payload.sessionId),
    'storage:export': () => handleExportData(),
    'storage:clear-history': () => handleClearHistory(),
  };

  const handler = handlers[message.type];

  if (!handler) {
    sendResponse({
      ok: false,
      error: `Mensagem não suportada: ${message.type}`,
    });
    return false;
  }

  handler()
    .then((result) => sendResponse({ ok: true, ...result }))
    .catch((error) => sendResponse({ ok: false, error: error.message }));

  return true;
});
