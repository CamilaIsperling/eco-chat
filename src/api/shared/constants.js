export const STORAGE_KEYS = {
  settings: 'iaSustentavelSettings',
  sessions: 'iaSustentavelSessions',
  activeByTab: 'iaSustentavelActiveByTab',
};

export const CHATGPT_HOSTS = ['chatgpt.com', 'chat.openai.com'];

export const RANGE_PRESETS = {
  today: {
    id: 'today',
    label: 'Hoje',
    days: 1,
  },
  sevenDays: {
    id: 'sevenDays',
    label: '7 dias',
    days: 7,
  },
  thirtyDays: {
    id: 'thirtyDays',
    label: '30 dias',
    days: 30,
  },
};

export const IMPACT_LEVELS = ['baixo', 'moderado', 'alto', 'critico'];

export const IMPACT_LEVEL_META = {
  baixo: {
    label: 'Baixo',
    badgeClass: 'bg-emerald-500',
    badgeHex: '#16a34a',
    accentHex: '#2f9e79',
  },
  moderado: {
    label: 'Moderado',
    badgeClass: 'bg-amber-400',
    badgeHex: '#fbbf24',
    accentHex: '#f59e0b',
  },
  alto: {
    label: 'Alto',
    badgeClass: 'bg-orange-500',
    badgeHex: '#f97316',
    accentHex: '#f97316',
  },
  critico: {
    label: 'Crítico',
    badgeClass: 'bg-red-500',
    badgeHex: '#ef4444',
    accentHex: '#ef4444',
  },
};

export const DEFAULT_SETTINGS = {
  monitoring: {
    autoDetect: true,
    domains: {
      chatgpt: true,
      gemini: false,
      copilot: false,
    },
  },
  alerts: {
    showBadge: true,
    showImpactAlerts: true,
    minimumLevel: 'alto',
  },
  primaryUnit: 'co2e',
};

export const METRIC_FACTORS = {
  whPerMessage: 3.5,
  whPerActiveSecond: 0.09,
  whPerResponseSecond: 0.18,
  gramsCo2ePerKWh: 300,
  litersWaterPerKWh: 3.75,
};

export const EDUCATIONAL_TIPS = [
  'Faça perguntas mais completas para reduzir iterações.',
  'Evite reenviar prompts muito parecidos em sequência.',
  'Finalize sessões antigas quando terminar a conversa.',
];

