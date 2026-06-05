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

// Fatores de conversão usados nos cálculos ao vivo (client-side).
// IMPORTANTE: são estimativas de ordem de grandeza, não medições oficiais.
// Cada fator traz a fonte; alternativas acadêmicas ficam em ACADEMIC_FACTORS.
// Origem, fórmulas, limitações e divergências em docs/METRICAS.md.
export const METRIC_FACTORS = {
  // Energia por mensagem trocada (proxy do custo de inferência por interação).
  // Calibrado para a faixa de impacto da interface; alternativa por consulta em
  // ACADEMIC_FACTORS (Epoch AI 2025: ~0,3 Wh; de Vries, Joule 2023: ~2,9 Wh).
  whPerMessage: 3.5,
  // Energia atribuída ao tempo de aba ativa e ao tempo de resposta do serviço.
  whPerActiveSecond: 0.09,
  whPerResponseSecond: 0.18,
  // Intensidade de carbono da rede elétrica (g CO2e por kWh).
  // Média global ~473 g/kWh em 2024 (Ember, 2025); aqui 300 reflete uma matriz
  // mais limpa. Ajuste conforme a região (ver ACADEMIC_FACTORS.gramsCo2ePerKWh).
  gramsCo2ePerKWh: 300,
  // Água por kWh (resfriamento + geração) — usado SÓ no fallback de água,
  // quando a conversa não traz contagem de palavras. Derivado de Li et al. (2023).
  litersWaterPerKWh: 3.75,
  // Água por palavra gerada (MÉTRICA PRINCIPAL de água).
  // 519 ml por resposta de ~100 palavras -> 5,19 ml/palavra.
  // Fonte: Li, Yang, Islam & Ren, "Making AI Less 'Thirsty'", arXiv:2304.03271
  // (2023) / Communications of the ACM (2025). Divergência em docs/METRICAS.md.
  mlWaterPerWord: 5.19,
};

// Valores alternativos fundamentados em literatura recente, prontos para troca
// ("os dois, configurável"). NÃO são usados por padrão — servem de referência e
// permitem recalibrar facilmente. Ver docs/METRICAS.md.
export const ACADEMIC_FACTORS = {
  // Energia por CONSULTA (resposta), em vez de por mensagem + tempo:
  whPerQuery: 0.3, // Epoch AI (2025), GPT-4o típico
  whPerQueryAlt: 2.9, // de Vries, Joule (2023), estimativa mais antiga (~10x)
  // Intensidade de carbono média global (Ember, Global Electricity Review 2025):
  gramsCo2ePerKWh: 473, // 2024; UE ~213, China ~560 (varia muito por região)
  // Água por palavra (mesma fonte do principal, mantida aqui por completude):
  mlWaterPerWord: 5.19, // Li et al. (2023/2025)
};

export const EDUCATIONAL_TIPS = [
  'Faça perguntas mais completas para reduzir iterações.',
  'Evite reenviar prompts muito parecidos em sequência.',
  'Finalize sessões antigas quando terminar a conversa.',
];
