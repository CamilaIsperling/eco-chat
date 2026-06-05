# Métricas Ambientais — Fundamentação

Documentação das métricas ambientais estimadas pela extensão **ChatGPT Sustentável**.
Para cada métrica: **origem**, **fórmula**, **limitações**, **fonte** e por que é
**adequada** a um projeto acadêmico de conscientização.

> Onde os cálculos acontecem: tudo roda no **lado do cliente (JavaScript)**, dentro do
> navegador, em tempo real — sem servidor e sem enviar dados para fora. Os fatores de
> conversão estão em [`src/api/shared/constants.js`](../src/api/shared/constants.js)
> (`METRIC_FACTORS` e `ACADEMIC_FACTORS`) e as fórmulas em
> [`src/api/shared/metrics.js`](../src/api/shared/metrics.js) (`calculateSessionMetrics`).

> **Aviso geral de honestidade científica:** todos os números são **estimativas de ordem
> de grandeza**, não medições oficiais. A OpenAI não publica o consumo real por
> interação; trabalhamos com aproximações da literatura. O objetivo da ferramenta é
> **percepção e reflexão**, não precisão absoluta.

## Sinais coletados (entrada dos cálculos)

A extensão observa apenas o que está visível na página (DOM) do ChatGPT:

| Sinal                          | Como é obtido                                                       |
| ------------------------------ | ------------------------------------------------------------------- |
| Mensagens enviadas / recebidas | Contagem de elementos `[data-message-author-role]`                  |
| **Palavras geradas pela IA**   | Soma das palavras das respostas do assistente (`generatedWords`)    |
| Tempo de atividade             | Acúmulo por intervalo, considerando aba visível e interação recente |
| Tempo de resposta              | API `Performance` (marca entre pergunta e resposta)                 |
| Data/hora                      | Carimbo de tempo da sessão                                          |

---

## 1. Consumo estimado de ÁGUA — _métrica principal_

- **Origem.** É a métrica mais citada sobre o custo ambiental da IA: gerar texto com o
  ChatGPT consome água, sobretudo no **resfriamento dos data centers** e na **geração da
  eletricidade**. O estudo de referência estima **≈519 ml de água por resposta de ~100
  palavras** (GPT-4) — daí a imagem popular da "garrafinha de água por e-mail".
- **Fórmula (principal, por palavras geradas pela IA):**
  ```
  agua_litros = palavras_geradas × 5,19 ml / 1000
  ```
  `5,19 ml/palavra` = 519 ml ÷ 100 palavras (`METRIC_FACTORS.mlWaterPerWord`).
  Conta **apenas o texto gerado pela IA** (respostas do assistente), pois é sobre o
  conteúdo gerado que a fonte mede o consumo de água — as perguntas do usuário não entram.
- **Fórmula (fallback, sem contagem de palavras):**
  ```
  agua_litros = energia_kWh × 3,75 L/kWh   (METRIC_FACTORS.litersWaterPerKWh)
  ```
- **Divergência entre estudos (documentar no TCC):**
  - Versão de 2023 (arXiv, GPT-3): **~500 ml por conversa de 20–50 perguntas**.
  - Versão revisada (Communications of the ACM, 2025, GPT-4): **~519 ml por 100
    palavras geradas**.
  - O valor depende fortemente do **local e horário** do data center (eficiência de
    resfriamento + matriz hídrica/elétrica local). A simplificação "500 ml / 100
    palavras" **tende a superestimar** quando aplicada a respostas longas.
- **Limitações.** Estimativa de ordem de grandeza; sem telemetria real da OpenAI; varia
  por região/estação; a contagem de palavras no streaming é aproximada.
- **Fonte.** LI, Pengfei; YANG, Jianyi; ISLAM, Mohammad A.; REN, Shaolei. _Making AI
  Less "Thirsty": Uncovering and Addressing the Secret Water Footprint of AI Models._
  arXiv:2304.03271, 2023 (revisado em _Communications of the ACM_, 2025).
  https://arxiv.org/pdf/2304.03271
- **Por que é adequada.** É a métrica mais tangível e reconhecível ("garrafas de água"),
  exatamente o enquadramento usado no TCC e no protótipo — ideal para conscientização.

## 2. Consumo estimado de ENERGIA elétrica

- **Origem.** Cada resposta exige inferência do modelo em GPUs nos data centers, o que
  consome eletricidade. Aqui a energia é estimada a partir do **número de mensagens** e
  do **tempo** de atividade/resposta (sinais observáveis no cliente).
- **Fórmula (atual, ao vivo):**
  ```
  energia_Wh  = total_mensagens × 3,5
              + segundos_ativos × 0,09
              + segundos_resposta × 0,18
  energia_kWh = energia_Wh / 1000
  ```
- **Divergência entre estudos (~10×).** Para a energia **por consulta** há valores bem
  diferentes na literatura:
  - **Epoch AI (2025): ≈0,3 Wh por consulta** (GPT-4o típico).
  - **de Vries (2023): ≈2,9 Wh por consulta** (estimativa mais antiga, hardware de 2023).
    Esses valores estão em `ACADEMIC_FACTORS` (`whPerQuery` e `whPerQueryAlt`) como
    **alternativa configurável**. Não são o padrão ao vivo porque, com ~0,3 Wh/consulta, o
    CO₂ por sessão ficaria abaixo de 1 g e a faixa de impacto/alertas da interface (pensada
    para dezenas de gramas) deixaria de fazer sentido. O modelo por mensagens+tempo mantém
    as ordens de grandeza para as quais a interface foi desenhada.
- **Limitações.** Depende do modelo (3.5 / 4o / o-series), do tamanho da resposta e da
  infraestrutura; é proxy, não medição.
- **Fontes.** EPOCH AI. _How much energy does ChatGPT use?_ (2025).
  https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use — DE VRIES, Alex.
  _The growing energy footprint of artificial intelligence._ Joule, v. 7, n. 10, 2023.
  DOI: 10.1016/j.joule.2023.09.004.
- **Por que é adequada.** É a base do cálculo de CO₂ e do fallback de água; e a
  divergência 0,3 vs 2,9 Wh rende uma ótima discussão de **incerteza de estimativas**.

## 3. Emissão estimada de CO₂

- **Origem.** Emissões = energia consumida × **intensidade de carbono da rede elétrica**
  (quanto CO₂ é emitido para gerar cada kWh).
- **Fórmula:**
  ```
  co2e_g = energia_kWh × g_CO2e_por_kWh
  ```
  Padrão ao vivo: `300 g/kWh` (`METRIC_FACTORS.gramsCo2ePerKWh`, matriz mais limpa).
- **Divergência / variação regional.** A média **global é ≈473 g CO₂/kWh em 2024**
  (Ember), mas varia muito: **UE ≈213**, **China ≈560**. O valor 473 está em
  `ACADEMIC_FACTORS.gramsCo2ePerKWh` para troca conforme a região.
- **Limitações.** Usa um valor médio, não a localização real do data center; considera
  apenas a operação (inferência), não a fabricação de hardware nem o treinamento.
- **Fontes.** EMBER. _Global Electricity Review 2025._
  https://ember-energy.org/latest-insights/global-electricity-review-2025/ — IEA.
  _Electricity 2025 — Emissions._ https://www.iea.org/reports/electricity-2025/emissions
- **Por que é adequada.** CO₂ é a unidade de impacto ambiental mais reconhecível e já é a
  base do nível de impacto exibido na interface.

## 4. Índice geral de impacto ambiental da conversa

- **Origem.** Um rótulo único (**baixo / moderado / alto / crítico**) que resume o
  impacto da conversa, calculado a partir dos gramas de CO₂e. **Não há consenso
  científico** sobre um índice único — portanto, os limiares são uma **escolha de projeto
  configurável** (e assim documentada).
- **Fórmula / faixas (em `getImpactLevel`, configuráveis):**
  ```
  co2e_g < 18  -> baixo
  co2e_g ≥ 18  -> moderado
  co2e_g ≥ 40  -> alto
  co2e_g ≥ 90  -> crítico
  ```
  A barra de 4 segmentos da interface (`buildImpactSegments`) normaliza o CO₂e em uma
  escala de 0 a 100 g.
- **Limitações.** Os limiares são arbitrários (definidos para o projeto), não normativos;
  servem à conscientização, não à classificação científica.
- **Fonte.** Composição própria — o insumo (CO₂e) tem fonte (item 3); o índice em si não
  tem fonte única.
- **Por que é adequada.** O objetivo do trabalho é gerar **percepção e reflexão**, não
  medição exata; um índice honesto, simples e configurável é o formato correto aqui.

## 5. Alertas de conscientização (limites configuráveis)

- **Origem.** Princípio de **intervenção no ponto de uso**: a informação tem mais efeito
  quando aparece no momento da ação. O usuário define um **nível mínimo** a partir do
  qual quer ser alertado.
- **Lógica (em `maybeSendImpactAlert`,
  [service-worker.js](../src/api/background/service-worker.js)):**
  dispara um alerta quando o nível de impacto atual **≥ nível mínimo configurado**
  (`settings.alerts.minimumLevel`, padrão `alto`) **e** é maior que o último já
  notificado (evita repetição).
- **Limitações.** Os limiares são configuráveis/arbitrários (não normativos).
- **Fonte.** Design alinhado a KERN, E.; GULDNER, A.; NAUMANN, S. _Including software
  aspects in green IT_ (2018), já presente no referencial teórico do TCC.
- **Por que é adequada.** Transforma um custo ambiental invisível em um **ponto de
  atenção** exatamente quando o usuário pode decidir continuar ou encerrar a sessão.

---

## Configurabilidade ("os dois")

Os valores ao vivo ficam em `METRIC_FACTORS` e as alternativas acadêmicas em
`ACADEMIC_FACTORS`, ambos em
[`src/api/shared/constants.js`](../src/api/shared/constants.js). Para recalibrar (ex.:
usar a intensidade de carbono da sua região, ou a energia por consulta da Epoch AI),
basta trocar os números nesse arquivo — nenhuma outra parte do código precisa mudar.

## Referências

- LI, P.; YANG, J.; ISLAM, M. A.; REN, S. _Making AI Less "Thirsty"._ arXiv:2304.03271,
  2023 / Communications of the ACM, 2025. https://arxiv.org/pdf/2304.03271
- EPOCH AI. _How much energy does ChatGPT use?_ 2025.
  https://epoch.ai/gradient-updates/how-much-energy-does-chatgpt-use
- DE VRIES, A. _The growing energy footprint of artificial intelligence._ Joule, v. 7,
  n. 10, p. 2191–2194, 2023. DOI: 10.1016/j.joule.2023.09.004
- EMBER. _Global Electricity Review 2025._
  https://ember-energy.org/latest-insights/global-electricity-review-2025/
- IEA. _Electricity 2025 — Emissions._
  https://www.iea.org/reports/electricity-2025/emissions
- KERN, E.; GULDNER, A.; NAUMANN, S. _Including software aspects in green IT._ 2018.
