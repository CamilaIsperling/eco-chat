import { RANGE_PRESETS } from './constants.js';
import { getDomainLabel } from './metrics.js';

function toRangeStart(now, rangeId) {
  const current = new Date(now);

  if (rangeId === 'today') {
    current.setHours(0, 0, 0, 0);
    return current.getTime();
  }

  const days = RANGE_PRESETS[rangeId]?.days || 1;
  current.setHours(0, 0, 0, 0);
  current.setDate(current.getDate() - (days - 1));
  return current.getTime();
}

function getPreviousRangeStart(now, rangeId) {
  const currentRangeStart = toRangeStart(now, rangeId);
  const days = RANGE_PRESETS[rangeId]?.days || 1;
  return currentRangeStart - days * 24 * 60 * 60 * 1000;
}

function aggregateMostUsed(sessions) {
  const counter = new Map();

  sessions.forEach((session) => {
    const key = getDomainLabel(session.domain);
    counter.set(key, (counter.get(key) || 0) + 1);
  });

  const [label] = [...counter.entries()].sort((left, right) => right[1] - left[1])[0] || ['-'];
  return label;
}

export function buildHistorySnapshot(sessionMapOrList, rangeId, now = Date.now()) {
  const sessions = Array.isArray(sessionMapOrList)
    ? sessionMapOrList
    : Object.values(sessionMapOrList || {});
  const currentStart = toRangeStart(now, rangeId);
  const previousStart = getPreviousRangeStart(now, rangeId);

  const currentSessions = sessions
    .filter((session) => Number(session.updatedAt || session.startedAt || 0) >= currentStart)
    .sort((left, right) => Number(right.updatedAt || 0) - Number(left.updatedAt || 0));
  const previousSessions = sessions.filter((session) => {
    const timestamp = Number(session.updatedAt || session.startedAt || 0);
    return timestamp >= previousStart && timestamp < currentStart;
  });

  const totalConversations = currentSessions.length;
  const totalCo2e = currentSessions.reduce(
    (sum, session) => sum + Number(session.metrics?.co2eGrams || 0),
    0,
  );
  const totalEnergyKWh = currentSessions.reduce(
    (sum, session) => sum + Number(session.metrics?.energyKWh || 0),
    0,
  );
  const totalDurationMs = currentSessions.reduce(
    (sum, session) => sum + Number(session.activityMs || 0),
    0,
  );
  const previousCo2e = previousSessions.reduce(
    (sum, session) => sum + Number(session.metrics?.co2eGrams || 0),
    0,
  );
  const trendPercentage = previousCo2e > 0 ? ((totalCo2e - previousCo2e) / previousCo2e) * 100 : 0;

  return {
    id: rangeId,
    label: RANGE_PRESETS[rangeId]?.label || 'Período',
    totalConversations,
    totalCo2e: Number(totalCo2e.toFixed(1)),
    totalEnergyKWh: Number(totalEnergyKWh.toFixed(3)),
    totalDurationMs,
    mostUsedLabel: aggregateMostUsed(currentSessions),
    trendPercentage: Number(trendPercentage.toFixed(1)),
    sessions: currentSessions.map((session) => ({
      id: session.id,
      domainLabel: getDomainLabel(session.domain),
      updatedAt: session.updatedAt,
      activityMs: session.activityMs,
      co2eGrams: session.metrics?.co2eGrams || 0,
      impactLevel: session.metrics?.impactLevel || session.impactLevel || 'baixo',
    })),
  };
}

