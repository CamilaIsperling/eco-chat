import { getMockPopupState } from './mockState.js';

function isExtensionEnvironment() {
  return Boolean(globalThis.chrome?.runtime?.id);
}

function sendRuntimeMessage(message) {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
        return;
      }

      if (!response?.ok) {
        reject(
          new Error(
            response?.error || 'Falha inesperada ao comunicar com a extensão.',
          ),
        );
        return;
      }

      resolve(response);
    });
  });
}

export async function fetchPopupState() {
  const params = new URLSearchParams(window.location.search);

  if (!isExtensionEnvironment() || params.get('mock') === '1') {
    return getMockPopupState(params.get('nivel') ?? undefined);
  }

  return sendRuntimeMessage({ type: 'popup:get-state' });
}

export async function updateSettings(patch) {
  if (!isExtensionEnvironment()) {
    return { settings: patch };
  }

  return sendRuntimeMessage({
    type: 'settings:update',
    payload: patch,
  });
}

export async function dismissAlert(sessionId) {
  if (!isExtensionEnvironment()) {
    return { session: null };
  }

  return sendRuntimeMessage({
    type: 'alert:dismiss',
    payload: { sessionId },
  });
}

export async function exportCollectedData() {
  if (!isExtensionEnvironment()) {
    return {
      exportedAt: Date.now(),
      settings: getMockPopupState().settings,
      sessions: [getMockPopupState().activeSession],
    };
  }

  return sendRuntimeMessage({
    type: 'storage:export',
  });
}

export async function clearCollectedHistory() {
  if (!isExtensionEnvironment()) {
    return {
      history: {
        today: {
          sessions: [],
          totalConversations: 0,
          totalCo2e: 0,
          totalDurationMs: 0,
          mostUsedLabel: '-',
        },
        sevenDays: {
          sessions: [],
          totalConversations: 0,
          totalCo2e: 0,
          totalDurationMs: 0,
          mostUsedLabel: '-',
        },
        thirtyDays: {
          sessions: [],
          totalConversations: 0,
          totalCo2e: 0,
          totalDurationMs: 0,
          mostUsedLabel: '-',
        },
      },
    };
  }

  return sendRuntimeMessage({
    type: 'storage:clear-history',
  });
}
