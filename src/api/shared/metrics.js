import { IMPACT_LEVEL_META, METRIC_FACTORS } from './constants.js';

export function roundTo(value, digits = 2) {
  return Number.parseFloat(Number(value || 0).toFixed(digits));
}

export function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

export function calculateSessionMetrics(session) {
  const sentMessages = Number(session.sentMessages || 0);
  const receivedMessages = Number(session.receivedMessages || 0);
  const totalMessages = sentMessages + receivedMessages;
  const activityMs = Number(session.activityMs || 0);
  const totalResponseMs = Number(
    session.totalResponseMs ||
      (Array.isArray(session.responseTimesMs)
        ? session.responseTimesMs.reduce((sum, value) => sum + Number(value || 0), 0)
        : 0),
  );
  const averageResponseMs =
    Number(session.averageResponseMs || 0) ||
    (receivedMessages > 0 ? totalResponseMs / receivedMessages : 0);

  const activitySeconds = activityMs / 1000;
  const responseSeconds = totalResponseMs / 1000;

  const energyWh =
    totalMessages * METRIC_FACTORS.whPerMessage +
    activitySeconds * METRIC_FACTORS.whPerActiveSecond +
    responseSeconds * METRIC_FACTORS.whPerResponseSecond;
  const energyKWh = energyWh / 1000;
  const co2eGrams = energyKWh * METRIC_FACTORS.gramsCo2ePerKWh;
  const waterLiters = energyKWh * METRIC_FACTORS.litersWaterPerKWh;

  return {
    totalMessages,
    averageResponseMs: roundTo(averageResponseMs, 0),
    totalResponseMs: roundTo(totalResponseMs, 0),
    energyWh: roundTo(energyWh, 2),
    energyKWh: roundTo(energyKWh, 3),
    co2eGrams: roundTo(co2eGrams, 1),
    waterLiters: roundTo(waterLiters, 2),
    impactLevel: getImpactLevel(co2eGrams),
  };
}

export function getImpactLevel(co2eGrams) {
  if (co2eGrams >= 90) {
    return 'critico';
  }
  if (co2eGrams >= 40) {
    return 'alto';
  }
  if (co2eGrams >= 18) {
    return 'moderado';
  }
  return 'baixo';
}

export function formatDuration(durationMs) {
  const totalSeconds = Math.max(0, Math.round(durationMs / 1000));
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }

  if (minutes > 0) {
    return `${minutes}m ${String(seconds).padStart(2, '0')}s`;
  }

  return `${seconds}s`;
}

export function formatMetric(value, type = 'co2e') {
  const formatters = {
    co2e: `${roundTo(value, 1)} g CO2e`,
    energy: `${roundTo(value, 2)} kWh`,
    water: `${roundTo(value, 2)} L`,
    plain: `${roundTo(value, 0)}`,
  };

  return formatters[type] || formatters.plain;
}

export function getDomainLabel(domain) {
  if (!domain) {
    return 'Conversa';
  }

  if (domain.includes('chatgpt') || domain.includes('openai')) {
    return 'ChatGPT';
  }

  return domain;
}

export function getBadgeText(session, primaryUnit = 'co2e') {
  if (!session?.metrics) {
    return '';
  }

  if (primaryUnit === 'energy') {
    return `${roundTo(session.metrics.energyKWh, 2)}`;
  }

  return `${Math.round(session.metrics.co2eGrams)}g`;
}

export function getImpactMeta(level) {
  return IMPACT_LEVEL_META[level] || IMPACT_LEVEL_META.baixo;
}

export function buildImpactSegments(co2eGrams) {
  const normalized = clamp(co2eGrams / 100, 0, 1);
  const filledSegments = Math.max(1, Math.round(normalized * 4));

  return Array.from({ length: 4 }, (_, index) => ({
    key: `segment-${index + 1}`,
    active: index < filledSegments,
  }));
}

