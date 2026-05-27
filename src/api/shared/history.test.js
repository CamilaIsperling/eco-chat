import { buildHistorySnapshot } from './history.js';

const now = new Date('2026-04-01T15:00:00-03:00').getTime();

const sessions = [
  {
    id: '1',
    domain: 'chatgpt.com',
    updatedAt: new Date('2026-04-01T10:00:00-03:00').getTime(),
    activityMs: 300000,
    metrics: { co2eGrams: 18, energyKWh: 0.06 },
  },
  {
    id: '2',
    domain: 'chatgpt.com',
    updatedAt: new Date('2026-03-29T09:00:00-03:00').getTime(),
    activityMs: 480000,
    metrics: { co2eGrams: 32, energyKWh: 0.11 },
  },
  {
    id: '3',
    domain: 'chatgpt.com',
    updatedAt: new Date('2026-03-20T09:00:00-03:00').getTime(),
    activityMs: 120000,
    metrics: { co2eGrams: 8, energyKWh: 0.03 },
  },
];

describe('buildHistorySnapshot', () => {
  it('agrega o período selecionado', () => {
    const snapshot = buildHistorySnapshot(sessions, 'sevenDays', now);

    expect(snapshot.totalConversations).toBe(2);
    expect(snapshot.totalCo2e).toBe(50);
    expect(snapshot.mostUsedLabel).toBe('ChatGPT');
  });
});
