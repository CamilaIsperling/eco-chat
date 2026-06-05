# EcoChat

<p align="center">
  <strong>Extensão Chrome para tornar visível o impacto ambiental aproximado do uso do ChatGPT.</strong>
</p>

<p align="center">
  <img alt="Status" src="https://img.shields.io/badge/status-prot%C3%B3tipo%20funcional-1f8467">
  <img alt="Manifest V3" src="https://img.shields.io/badge/Chrome-Manifest%20V3-4285F4">
  <img alt="React" src="https://img.shields.io/badge/UI-React%20%2B%20Glamor-0f172a">
  <img alt="Build" src="https://img.shields.io/badge/Build-Vite-7C3AED">
  <img alt="Tests" src="https://img.shields.io/badge/Testes-Vitest-6D9F00">
  <img alt="License" src="https://img.shields.io/badge/Licen%C3%A7a-MIT-black">
</p>

---

## Visão geral

O projeto **EcoChat** nasceu como proposta de TCC para investigar uma pergunta simples e importante:

> Como tornar mais visível, no ponto de uso, o impacto ambiental associado às interações com chats de IA?

A solução proposta é uma **extensão para Google Chrome**, executada no lado do cliente, que monitora o uso do **ChatGPT**, estima métricas ambientais aproximadas por conversa e exibe essas informações ao usuário em tempo quase real.

Em vez de tratar a IA como algo invisível e "sem custo", a extensão busca traduzir sinais observáveis da conversa em indicadores fáceis de entender, como:

- CO2e estimado
- energia consumida
- água associada ao uso
- nível de impacto da sessão
- histórico de uso por período

---

## Objetivo do projeto

O objetivo central é **promover transparência e conscientização** no uso de assistentes baseados em IA.

Mais especificamente, o projeto busca:

- detectar o uso do ChatGPT no navegador
- observar sinais da interação, como quantidade de mensagens e tempo de resposta
- estimar métricas ambientais aproximadas por sessão
- apresentar essas métricas em uma interface clara e acessível
- incentivar práticas de uso mais responsáveis

---

## Escopo atual

Para manter o protótipo enxuto e alinhado ao recorte do TCC, o projeto foi reduzido para:

- navegador alvo: **Google Chrome**
- plataforma monitorada: **ChatGPT**
- arquitetura: **Extensão Chrome Manifest V3**

As referências a **Gemini** e **Copilot** permanecem apenas como extensão futura da solução.

---

## Experiência da extensão

O popup foi estruturado a partir das telas definidas no protótipo da interface e hoje contempla:

- **Resumo da conversa atual**
  - CO2e da sessão
  - mensagens
  - tempo de atividade
  - energia estimada
  - barra visual de impacto

- **Detalhes da conversa**
  - domínio monitorado
  - horário de início
  - mensagens enviadas e recebidas
  - energia e CO2e
  - evolução visual da sessão

- **Histórico**
  - visão por Hoje, 7 dias e 30 dias
  - total de conversas
  - total de CO2e
  - tempo de uso
  - exportação dos dados em JSON
  - limpeza do histórico

- **Configurações**
  - ativação da detecção automática
  - controle de badge
  - controle de alertas
  - unidade principal exibida
  - painel de status para validação manual

- **Alerta de impacto**
  - aviso visual quando a sessão atinge faixa alta de impacto

---

## Stack do projeto

### Frontend da extensão

- JavaScript
- React
- Glamor

### Ambiente de desenvolvimento e build

- Node.js
- npm
- Vite

### Arquitetura da extensão

- Chrome Extension Manifest V3
- content scripts
- service worker
- message passing

### Persistência local

- `chrome.storage.local`

### Testes e qualidade

- Vitest
- ESLint
- Prettier

### Apoio analítico

- Python apenas para gerar relatório CSV a partir dos dados exportados (os cálculos das métricas rodam no navegador, em JavaScript)

---

## Arquitetura da solução

```text
ChatGPT (DOM da página)
        |
        v
Content Script
- MutationObserver
- Performance API
- captura de mensagens e tempos
        |
        v
Service Worker
- consolida sessão
- calcula métricas
- gerencia badge e alertas
- persiste em chrome.storage.local
        |
        v
Popup React
- resumo
- detalhes
- histórico
- configurações
```

---

## Como as métricas são calculadas

As métricas do protótipo são **aproximadas** e foram pensadas para **conscientização**, não para medição física exata. A fundamentação completa (origem, fórmulas, limitações, fontes e divergências entre estudos) está em [docs/METRICAS.md](docs/METRICAS.md).

Os fatores atuais estão definidos em [constants.js](src/api/shared/constants.js).

Hoje, a estimativa considera:

- quantidade total de mensagens
- tempo de atividade observado
- soma dos tempos de resposta observados
- palavras geradas pela IA (base da métrica de água)

### Fórmula resumida

```text
energia (Wh) =
  mensagens * fator_por_mensagem +
  segundos_ativos * fator_por_atividade +
  segundos_de_resposta * fator_por_resposta

CO2e =
  energia_em_kWh * fator_médio_de_emissão

água (principal) =
  palavras_geradas_pela_IA * fator_por_palavra
água (fallback, sem contagem de palavras) =
  energia_em_kWh * fator_hídrico_médio
```

### Fatores atuais do protótipo

- `3.5 Wh` por mensagem
- `0.09 Wh` por segundo de atividade
- `0.18 Wh` por segundo de resposta
- `300 g CO2e` por kWh
- `5.19 ml` de água por palavra gerada (≈519 ml / 100 palavras — Li et al.)
- `3.75 L` por kWh (usado apenas no fallback de água)

Valores acadêmicos alternativos (energia por consulta da Epoch AI; intensidade de carbono global da Ember) ficam documentados e prontos para troca em `ACADEMIC_FACTORS` ([constants.js](src/api/shared/constants.js)). Esses valores podem ser refinados conforme a evolução da pesquisa e da fundamentação teórica do TCC.

---

## Tecnologias utilizadas

| Camada           | Tecnologia           | Papel no projeto                                                      |
| ---------------- | -------------------- | --------------------------------------------------------------------- |
| UI               | React                | Construção do popup da extensão                                       |
| Estilo           | Glamor               | Estilos globais e componentes visuais do popup                        |
| Build            | Vite                 | Empacotamento rápido do projeto                                       |
| Extensão         | Manifest V3          | Estrutura oficial da extensão Chrome                                  |
| Coleta           | MutationObserver     | Observação de mudanças no DOM do ChatGPT                              |
| Coleta           | Performance API      | Medição de tempos de resposta                                         |
| Coordenação      | Service Worker       | Centralização da lógica e persistência                                |
| Armazenamento    | chrome.storage.local | Histórico, sessões e preferências                                     |
| Testes unitários | Vitest               | Validação da lógica de métricas                                       |
| Qualidade        | ESLint + Prettier    | Padronização e consistência do código                                 |
| Apoio analítico  | Python               | Relatório CSV a partir dos dados exportados (não calcula as métricas) |

---

## Estrutura do projeto

```text
green-ai-chat-extension/
├─ images/
│  └─ logo-source.jpg
├─ public/
│  └─ manifest.json
├─ scripts/
│  ├─ generate_icons.py
│  └─ generate_metrics_report.py
├─ src/
│  ├─ api/
│  │  ├─ background/
│  │  │  └─ service-worker.js
│  │  ├─ content/
│  │  │  └─ chatgpt-content.js
│  │  └─ shared/
│  │     ├─ constants.js
│  │     ├─ history.js
│  │     ├─ history.test.js
│  │     ├─ metrics.js
│  │     └─ metrics.test.js
│  └─ ui/
│     ├─ api.js
│     ├─ App.jsx
│     ├─ glamorGlobals.js
│     ├─ main.jsx
│     ├─ mockState.js
│     ├─ PopupApp.jsx
│     ├─ components/
│     │  ├─ details-row/
│     │  ├─ feedback-box/
│     │  ├─ history-card/
│     │  ├─ impact-bar/
│     │  ├─ metric-chip/
│     │  ├─ monitoring-banner/
│     │  ├─ session-chart/
│     │  └─ toggle/
│     ├─ modules/
│     │  ├─ classNames.js
│     │  ├─ formatters.js
│     │  ├─ globalStyles.js
│     │  ├─ popupConstants.js
│     │  ├─ theme.js
│     │  └─ typographyStyles.js
│     └─ views/
│        ├─ alert-view/
│        ├─ details-view/
│        ├─ empty-state/
│        ├─ history-view/
│        ├─ settings-view/
│        └─ summary-view/
├─ package.json
└─ vite.config.js
```

---

## Arquivos principais

- Popup principal: [PopupApp.jsx](src/ui/PopupApp.jsx)
- Entrada do popup: [main.jsx](src/ui/main.jsx)
- Comunicação do popup: [api.js](src/ui/api.js)
- Estado mock para desenvolvimento: [mockState.js](src/ui/mockState.js)
- Componentes visuais: [src/ui/components](src/ui/components)
- Telas do popup: [src/ui/views](src/ui/views)
- Módulos compartilhados do popup: [src/ui/modules](src/ui/modules)
- Service worker: [service-worker.js](src/api/background/service-worker.js)
- Content script: [chatgpt-content.js](src/api/content/chatgpt-content.js)
- Cálculo das métricas: [metrics.js](src/api/shared/metrics.js)
- Histórico agregado: [history.js](src/api/shared/history.js)
- Fatores e configurações padrão: [constants.js](src/api/shared/constants.js)
- Manifest da extensão: [manifest.json](public/manifest.json)
- Geração de ícones: [generate_icons.py](scripts/generate_icons.py)
- Exportação de métricas: [generate_metrics_report.py](scripts/generate_metrics_report.py)

---

## Como rodar o projeto

### 1. Instalar dependências

```bash
npm install
```

### 2. Rodar em modo desenvolvimento

```bash
npm run dev
```

### 3. Gerar build da extensão

```bash
npm run build
```

### 4. Carregar no Chrome

1. Abra `chrome://extensions`
2. Ative `Modo do desenvolvedor`
3. Clique em `Carregar sem compactação`
4. Selecione a pasta `dist`

### 5. Testar com o ChatGPT

1. Abra `https://chatgpt.com`
2. Envie uma mensagem
3. Aguarde a resposta
4. Abra o popup da extensão
5. Verifique se os dados da sessão aparecem

---

## Scripts disponíveis

```bash
npm run dev          # servidor de desenvolvimento
npm run build        # gera a pasta dist
npm run watch        # rebuild automático ao salvar arquivos
npm run preview      # visualização do build
npm run lint         # validação estática do código
npm run format       # formata o código com Prettier
npm run check-format # verifica formatação sem alterar
npm run test         # executa os testes unitários
npm run test:watch   # testes em modo watch
```

---

## Testes realizados

Até o estado atual do projeto, foram executadas e validadas as seguintes etapas:

- `npm run lint`
  - validação estática do código

- `npm run test`
  - testes unitários com Vitest para:
    - cálculo de métricas
    - agregação de histórico

- `npm run build`
  - geração bem-sucedida da pasta `dist`
  - verificação do empacotamento da extensão

### Situação dos testes

| Tipo                       | Status       | Observação                                |
| -------------------------- | ------------ | ----------------------------------------- |
| ESLint                     | Concluído    | Sem erros no estado atual                 |
| Vitest                     | Concluído    | Testes unitários passando                 |
| Build Vite                 | Concluído    | Build gerado com sucesso                  |
| Validação manual no Chrome | Em andamento | Processo guiado durante o desenvolvimento |

---

## Validação manual

Roteiro para validar a extensão diretamente no Chrome:

- carga da extensão
- teste do monitoramento
- teste de histórico
- teste das configurações
- teste de exportação
- teste de limpeza de histórico

---

## Exportação de dados

O popup permite exportar os dados coletados em formato JSON.

Além disso, existe um script Python para converter dados exportados em CSV:

```bash
python scripts/generate_metrics_report.py ./entrada.json ./saida.csv
```

Arquivo relacionado:

- [generate_metrics_report.py](/c:/Repositorios/green-ai-chat-extension/scripts/generate_metrics_report.py)

---

## Funcionalidades já implementadas

- monitoramento do ChatGPT via content script
- medição de mensagens e tempo de atividade
- medição aproximada de tempo de resposta com `Performance API`
- cálculo de energia, CO2e e água (água estimada pelas palavras geradas pela IA)
- armazenamento em `chrome.storage.local`
- popup com múltiplas telas
- histórico por período
- exportação de dados
- limpeza de histórico
- painel de status para depuração manual
- badge da extensão com valor resumido
- alertas de impacto por sessão

---

## Limitações atuais

Como todo protótipo acadêmico em evolução, existem limites importantes:

- a solução está focada somente no ChatGPT
- os fatores ambientais ainda são aproximados
- o DOM do ChatGPT pode mudar ao longo do tempo
- a medição é simbólica e educativa, não uma auditoria energética real

---

## Próximos passos

- refinar os seletores do ChatGPT com base na validação manual
- melhorar a precisão das estimativas ambientais
- ampliar suporte para Gemini e Copilot
- preparar uma versão mais estável para demonstração do TCC

---

## Extensões recomendadas no VS Code

Para desenvolver o projeto com mais conforto, é recomendado instalar:

- ESLint
- Prettier - Code formatter
- Glamor snippets \(opcional\)

---

## Licença

Este projeto está sob a licença MIT.

Consulte [LICENSE](/c:/Repositorios/green-ai-chat-extension/LICENSE).

---

## Resumo rápido

O **EcoChat** é uma extensão Chrome construída com **JavaScript, React, Glamor, Vite e Manifest V3** para monitorar o uso do **ChatGPT** e traduzir a conversa em **métricas ambientais aproximadas**, com foco em **transparência, educação e uso responsável de IA**.
