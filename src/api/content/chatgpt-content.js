const ACTIVITY_PING_MS = 5000;
const ACTIVE_IDLE_WINDOW_MS = 60000;

const state = {
  sessionId: `chatgpt-${crypto.randomUUID()}`,
  startedAt: Date.now(),
  updatedAt: Date.now(),
  domain: window.location.hostname,
  url: window.location.href,
  sentMessages: 0,
  receivedMessages: 0,
  generatedWords: 0,
  activityMs: 0,
  totalResponseMs: 0,
  responseTimesMs: [],
  awaitingAssistant: false,
  lastUserPromptMark: null,
  lastActivityTickAt: Date.now(),
  lastUserInteractionAt: Date.now(),
};

function touchInteraction() {
  state.lastUserInteractionAt = Date.now();
}

function shouldAccumulateActivity(now) {
  return (
    document.visibilityState === 'visible' &&
    (state.awaitingAssistant ||
      now - state.lastUserInteractionAt <= ACTIVE_IDLE_WINDOW_MS)
  );
}

function tickActivity() {
  const now = Date.now();
  const delta = now - state.lastActivityTickAt;

  if (delta > 0 && shouldAccumulateActivity(now)) {
    state.activityMs += delta;
  }

  state.lastActivityTickAt = now;
}

function countWords(text) {
  const trimmed = (text || '').trim();
  return trimmed ? trimmed.split(/\s+/).length : 0;
}

function countMessages() {
  const userMessageNodes = [
    ...document.querySelectorAll('[data-message-author-role="user"]'),
  ];
  const assistantMessageNodes = [
    ...document.querySelectorAll('[data-message-author-role="assistant"]'),
  ];

  const userNodes = new Set(
    userMessageNodes.map((node) => node.closest('article') || node),
  );
  const assistantNodes = new Set(
    assistantMessageNodes.map((node) => node.closest('article') || node),
  );

  // Palavras GERADAS pela IA (apenas as respostas do assistente), base da
  // métrica principal de água (Li et al.: ~519 ml por 100 palavras geradas).
  // Atualiza em tempo real conforme a resposta é transmitida (streaming).
  const generatedWords = assistantMessageNodes.reduce(
    (sum, node) => sum + countWords(node.textContent),
    0,
  );

  return {
    sentMessages: userNodes.size,
    receivedMessages: assistantNodes.size,
    generatedWords,
  };
}

function startResponseMeasure() {
  const promptMark = `ia-sustentavel-prompt-${state.sentMessages + 1}`;
  performance.mark(promptMark);
  state.lastUserPromptMark = promptMark;
  state.awaitingAssistant = true;
}

function finishResponseMeasure() {
  const responseMark = `ia-sustentavel-response-${state.receivedMessages + 1}`;
  const measureName = `ia-sustentavel-measure-${state.receivedMessages + 1}`;

  performance.mark(responseMark);

  try {
    performance.measure(measureName, state.lastUserPromptMark, responseMark);
    const entry = performance.getEntriesByName(measureName, 'measure').at(-1);
    const duration = Math.round(entry?.duration || 0);

    if (duration > 0) {
      state.responseTimesMs.push(duration);
      state.totalResponseMs += duration;
    }
  } finally {
    if (state.lastUserPromptMark) {
      performance.clearMarks(state.lastUserPromptMark);
    }
    performance.clearMarks(responseMark);
    performance.clearMeasures(measureName);
    state.lastUserPromptMark = null;
    state.awaitingAssistant = false;
  }
}

function syncConversationState() {
  tickActivity();

  const current = countMessages();

  if (current.sentMessages > state.sentMessages) {
    touchInteraction();
    startResponseMeasure();
  }

  if (
    current.receivedMessages > state.receivedMessages &&
    state.awaitingAssistant
  ) {
    finishResponseMeasure();
  }

  state.sentMessages = current.sentMessages;
  state.receivedMessages = current.receivedMessages;
  state.generatedWords = current.generatedWords;
  state.updatedAt = Date.now();
  state.url = window.location.href;

  queueSessionUpdate();
}

let queuedReport = 0;

function queueSessionUpdate() {
  window.clearTimeout(queuedReport);
  queuedReport = window.setTimeout(() => {
    chrome.runtime.sendMessage({
      type: 'session:update',
      payload: {
        sessionId: state.sessionId,
        domain: state.domain,
        url: state.url,
        startedAt: state.startedAt,
        updatedAt: state.updatedAt,
        sentMessages: state.sentMessages,
        receivedMessages: state.receivedMessages,
        generatedWords: state.generatedWords,
        activityMs: state.activityMs,
        totalResponseMs: state.totalResponseMs,
        averageResponseMs:
          state.responseTimesMs.length > 0
            ? Math.round(state.totalResponseMs / state.responseTimesMs.length)
            : 0,
        responseTimesMs: state.responseTimesMs.slice(-20),
      },
    });
  }, 200);
}

function removeAlertToast() {
  document.getElementById('ia-sustentavel-alert')?.remove();
}

function renderAlertToast(payload) {
  removeAlertToast();

  const wrapper = document.createElement('div');
  wrapper.id = 'ia-sustentavel-alert';
  wrapper.style.position = 'fixed';
  wrapper.style.top = '18px';
  wrapper.style.right = '18px';
  wrapper.style.zIndex = '2147483647';
  wrapper.style.width = '320px';
  wrapper.style.borderRadius = '20px';
  wrapper.style.background = '#ffffff';
  wrapper.style.boxShadow = '0 16px 36px rgba(0, 0, 0, 0.18)';
  wrapper.style.overflow = 'hidden';
  wrapper.style.fontFamily = "'Trebuchet MS', 'Segoe UI', sans-serif";
  wrapper.innerHTML = `
    <div style="background:#1f8467;color:#fff;padding:16px 18px;font-weight:700;font-size:18px;">EcoChat</div>
    <div style="background:#ef4444;color:#fff;padding:10px 18px;font-weight:700;">Alerta de impacto ${payload.impactLevel}</div>
    <div style="padding:18px;">
      <div style="font-size:13px;color:#587168;">Estimado nesta conversa</div>
      <div style="margin-top:8px;font-size:34px;font-weight:800;color:#24413a;">${Math.round(payload.co2eGrams)} g CO2e</div>
      <div style="margin-top:8px;font-size:14px;color:#587168;">Energia aproximada: ${payload.energyKWh.toFixed(2)} kWh</div>
      <div style="display:flex;gap:10px;margin-top:18px;">
        <button id="ia-sustentavel-dismiss" style="flex:1;border:none;border-radius:12px;padding:12px 14px;background:#ef4444;color:#fff;font-weight:700;cursor:pointer;">Entendi</button>
      </div>
    </div>
  `;

  document.body.appendChild(wrapper);
  wrapper
    .querySelector('#ia-sustentavel-dismiss')
    ?.addEventListener('click', removeAlertToast);
}

const observer = new MutationObserver(() => {
  syncConversationState();
});

observer.observe(document.documentElement, {
  childList: true,
  subtree: true,
});

window.addEventListener('click', touchInteraction, { passive: true });
window.addEventListener('keydown', touchInteraction, { passive: true });
window.addEventListener('mousemove', touchInteraction, { passive: true });
document.addEventListener('visibilitychange', syncConversationState);

chrome.runtime.onMessage.addListener((message) => {
  if (message.type === 'impact:alert') {
    renderAlertToast(message.payload);
  }
});

window.setInterval(() => {
  syncConversationState();
}, ACTIVITY_PING_MS);

syncConversationState();
