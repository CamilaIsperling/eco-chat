import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import MetricChip from '../../components/metric-chip/index.jsx';
import MonitoringBanner from '../../components/monitoring-banner/index.jsx';
import ImpactBar from '../../components/impact-bar/index.jsx';
import { formatDuration, roundTo } from '../../../api/shared/metrics.js';
import { formatarDataHora } from '../../modules/formatters.js';
import { tituloHero, valorHero } from '../../modules/typographyStyles.js';
import { theme } from '../../modules/theme.js';

const styles = {
  hero: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: '16px',
    gap: '12px',
    backgroundColor: theme.cores.brand600,
    color: theme.cores.white,
    boxShadow: theme.sombras.suave,
  }),
  topo: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    borderRadius: '26px',
    backgroundColor: theme.cores.white,
    padding: '10px 16px',
    color: theme.cores.ink,
  }),
  marca: css({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
  }),
  icone: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '36px',
    height: '36px',
    borderRadius: theme.bordas.pill,
    backgroundColor: theme.cores.brand100,
    color: theme.cores.brand500,
    fontSize: '18px',
    lineHeight: '24px',
  }),
  botaoMenu: css({
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.slate100,
    padding: '6px 14px',
    color: theme.cores.slate500,
    fontSize: '20px',
    lineHeight: '24px',
    fontWeight: '700',
    transition: 'background-color 180ms ease, transform 180ms ease',
    ':hover': {
      backgroundColor: theme.cores.slate200,
      transform: 'translateY(-1px)',
    },
  }),
  painel: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: '26px',
    backgroundColor: 'rgba(87, 189, 153, 0.80)',
    padding: '16px',
    color: theme.cores.white,
    textAlign: 'center',
    height: '100%',
    justifyContent: 'center',
  }),
  subtitulo: css({
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
    letterSpacing: '0.03em',
  }),
  valor: css({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: '4px',
  }),
  unidade: css({
    fontSize: '15px',
    lineHeight: '22px',
    fontWeight: '600',
    opacity: 0.9,
  }),
  unidadeLegenda: css({
    fontSize: '11px',
    lineHeight: '14px',
    fontWeight: '500',
    opacity: 0.7,
  }),
  metricas: css({
    display: 'flex',
    width: '100%',
    gap: '10px',
    alignItems: 'center',
  }),
  acoes: css({
    display: 'flex',
    width: '100%',
    gap: '10px',
  }),
  botaoPrincipal: css({
    flex: '1 1 50%',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.brand400,
    padding: '10px 16px',
    color: theme.cores.white,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '700',
    transition: 'background-color 180ms ease, transform 180ms ease',
    ':hover': {
      backgroundColor: theme.cores.brand300,
      transform: 'translateY(-1px)',
    },
  }),
  status: css({
    display: 'flex',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    borderRadius: theme.bordas.xxl,
    backgroundColor: 'rgba(23, 101, 83, 0.55)',
    padding: '8px 12px',
    fontSize: '12px',
    lineHeight: '18px',
  }),
  textoStatus: css({
    minWidth: '0px',
  }),
  botaoStatus: css({
    borderRadius: theme.bordas.xl,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    padding: '4px 10px',
    color: theme.cores.white,
    fontSize: '12px',
    lineHeight: '18px',
    fontWeight: '700',
    transition: 'background-color 180ms ease',
    ':hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.25)',
    },
  }),
};

function SummaryView({
  session,
  isMonitoring,
  lastSyncAt,
  onRefresh,
  onOpenSettings,
  onOpenDetails,
  onOpenHistory,
}) {
  return (
    <div className={styles.hero}>
      <div className={styles.topo}>
        <div className={styles.marca}>
          <div className={styles.icone}>🍃</div>
          <div className={tituloHero}>EcoChatGPT</div>
        </div>
        <button
          type="button"
          className={styles.botaoMenu}
          onClick={onOpenSettings}
          aria-label="Abrir configurações"
        >
          ⋯
        </button>
      </div>

      <MonitoringBanner isMonitoring={isMonitoring} />

      <div className={styles.painel}>
        <div className={styles.subtitulo}>Impacto da conversa atual</div>
        <div className={classNames(valorHero, styles.valor)}>
          {Math.round(session.metrics.co2eGrams)}
          <div className={styles.unidade}>g CO2e</div>
        </div>
        <div className={styles.unidadeLegenda}>gramas de CO₂ equivalente</div>

        <div className={styles.metricas}>
          <MetricChip label="Mensagens" value={session.metrics.totalMessages} />
          <MetricChip
            label="Tempo de atividade"
            value={formatDuration(session.activityMs)}
            highlighted
          />
          <MetricChip
            label="Energia"
            value={`${roundTo(session.metrics.energyKWh, 2)} kWh`}
          />
        </div>

        <ImpactBar session={session} />
      </div>

      <div className={styles.acoes}>
        <button
          type="button"
          className={styles.botaoPrincipal}
          onClick={onOpenDetails}
        >
          Ver Detalhes
        </button>
        <button
          type="button"
          className={styles.botaoPrincipal}
          onClick={onOpenHistory}
        >
          Histórico
        </button>
      </div>

      <div className={styles.status}>
        <span className={styles.textoStatus}>
          Última sincronização: {formatarDataHora(lastSyncAt)}
        </span>
        <button
          type="button"
          className={styles.botaoStatus}
          onClick={onRefresh}
        >
          Atualizar
        </button>
      </div>
    </div>
  );
}

export default SummaryView;
