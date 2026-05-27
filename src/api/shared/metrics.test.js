import { calculateSessionMetrics, formatDuration, getImpactLevel } from './metrics.js';

describe('calculateSessionMetrics', () => {
  it('calcula energia, CO2e e água a partir da sessão', () => {
    const metrics = calculateSessionMetrics({
      sentMessages: 7,
      receivedMessages: 5,
      activityMs: 272000,
      totalResponseMs: 78000,
    });

    expect(metrics.energyKWh).toBeCloseTo(0.08, 2);
    expect(metrics.co2eGrams).toBeCloseTo(24, 0);
    expect(metrics.waterLiters).toBeCloseTo(0.3, 1);
    expect(metrics.impactLevel).toBe('moderado');
  });
});

describe('getImpactLevel', () => {
  it('retorna o nível esperado para cada faixa', () => {
    expect(getImpactLevel(10)).toBe('baixo');
    expect(getImpactLevel(25)).toBe('moderado');
    expect(getImpactLevel(60)).toBe('alto');
    expect(getImpactLevel(120)).toBe('critico');
  });
});

describe('formatDuration', () => {
  it('formata durações curtas e longas', () => {
    expect(formatDuration(32000)).toBe('32s');
    expect(formatDuration(272000)).toBe('4m 32s');
    expect(formatDuration(8100000)).toBe('2h 15m');
  });
});

