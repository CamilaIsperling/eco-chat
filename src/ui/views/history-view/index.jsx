import { css } from 'glamor';
import HistoryCard from '../../components/history-card/index.jsx';
import classNames from '../../modules/classNames.js';
import { RANGOS_HISTORICO } from '../../modules/popupConstants.js';
import { formatDuration } from '../../../api/shared/metrics.js';
import { tituloSecao } from '../../modules/typographyStyles.js';
import { theme } from '../../modules/theme.js';

const styles = {
  painel: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: '16px',
    gap: '10px',
    borderRadius: theme.bordas.cartao,
    backgroundColor: theme.cores.white,
    boxShadow: theme.sombras.suave,
  }),
  cabecalho: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
  }),
  botaoVoltar: css({
    borderRadius: theme.bordas.xl,
    backgroundColor: theme.cores.slate100,
    padding: '6px 10px',
    color: theme.cores.slate500,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '600',
  }),
  apoio: css({
    width: '36px',
    height: '36px',
    borderRadius: theme.bordas.pill,
    border: `1px solid ${theme.cores.slate200}`,
  }),
  selecaoPeriodo: css({
    display: 'flex',
    width: '100%',
    gap: '8px',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.slate100,
    padding: '4px',
    [theme.breakpoints.mobile]: {
      flexDirection: 'column',
    },
  }),
  botaoPeriodo: css({
    flex: '1 1 33.333%',
    minWidth: '0px',
    borderRadius: theme.bordas.xl,
    padding: '6px 10px',
    backgroundColor: 'transparent',
    color: theme.cores.slate500,
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
    transition: 'background-color 180ms ease, color 180ms ease',
    ':hover': {
      backgroundColor: 'rgba(215, 243, 232, 0.55)',
    },
    [theme.breakpoints.mobile]: {
      width: '100%',
      flexBasis: '100%',
    },
  }),
  botaoPeriodoAtivo: css({
    backgroundColor: theme.cores.brand100,
    color: theme.cores.brand700,
  }),
  resumo: css({
    display: 'flex',
    width: '100%',
    gap: '10px',
    flexWrap: 'wrap',
  }),
  listaSessoes: css({
    border: `1px solid ${theme.cores.slate200}`,
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.white,
    padding: '10px 12px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  }),
  itemSessao: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    fontSize: '13px',
    lineHeight: '18px',
    color: theme.cores.ink,
    [theme.breakpoints.mobile]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  }),
  origemSessao: css({
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    fontWeight: '600',
  }),
  iconeSessao: css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '20px',
    height: '20px',
    borderRadius: theme.bordas.pill,
    backgroundColor: theme.cores.emerald100,
    color: theme.cores.emerald700,
  }),
  metricasSessao: css({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: theme.cores.slate500,
    [theme.breakpoints.mobile]: {
      width: '100%',
      justifyContent: 'space-between',
    },
  }),
  valorSessao: css({
    fontWeight: '600',
    color: theme.cores.ink,
  }),
  vazia: css({
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.slate50,
    textAlign: 'center',
    fontSize: '13px',
    lineHeight: '18px',
    color: theme.cores.slate500,
  }),
  tendencia: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: '22px',
    backgroundColor: theme.cores.brand400,
    padding: '12px 16px',
    textAlign: 'center',
    color: theme.cores.white,
  }),
  tendenciaTexto: css({
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
  }),
  botaoClaroBloco: css({
    display: 'block',
    width: '100%',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.white,
    padding: '8px 16px',
    color: theme.cores.brand700,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '800',
    textAlign: 'center',
    textDecoration: 'none',
  }),
  acoes: css({
    display: 'flex',
    width: '100%',
    gap: '10px',
    [theme.breakpoints.mobile]: {
      flexDirection: 'column',
    },
  }),
  botaoContorno: css({
    flex: '1 1 50%',
    minWidth: '0px',
    borderRadius: theme.bordas.xxl,
    border: '1px solid rgba(255, 255, 255, 0.40)',
    backgroundColor: 'transparent',
    padding: '8px 16px',
    color: theme.cores.white,
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '700',
  }),
  botaoClaroAcao: css({
    flex: '1 1 50%',
    minWidth: '0px',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.white,
    padding: '8px 16px',
    color: theme.cores.brand700,
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '800',
  }),
};

function HistoryView({
  history,
  selectedRange,
  onRangeChange,
  onBack,
  onExportData,
  onClearHistory,
}) {
  const snapshot = history[selectedRange];

  return (
    <section className={styles.painel}>
      <div className={styles.cabecalho}>
        <button type="button" className={styles.botaoVoltar} onClick={onBack}>
          ←
        </button>
        <div className={tituloSecao}>Histórico</div>
        <div className={styles.apoio} />
      </div>

      <div className={styles.selecaoPeriodo}>
        {Object.entries(RANGOS_HISTORICO).map(([key, rangeKey]) => (
          <button
            key={rangeKey}
            type="button"
            className={classNames(
              styles.botaoPeriodo,
              selectedRange === rangeKey && styles.botaoPeriodoAtivo,
            )}
            onClick={() => onRangeChange(rangeKey)}
          >
            {key === 'today' ? 'Hoje' : key === 'sevenDays' ? '7 dias' : '30 dias'}
          </button>
        ))}
      </div>

      <div className={styles.resumo}>
        <HistoryCard label="Total de Conversas" value={snapshot.totalConversations} />
        <HistoryCard label="CO2 Estimado" value={Math.round(snapshot.totalCo2e)} />
        <HistoryCard label="Tempo de Uso" value={formatDuration(snapshot.totalDurationMs)} />
        <HistoryCard label="Mais Usado" value={snapshot.mostUsedLabel} />
      </div>

      <div className={styles.listaSessoes}>
        {snapshot.sessions.length > 0 ? (
          snapshot.sessions.map((session) => (
            <div key={session.id} className={styles.itemSessao}>
              <div className={styles.origemSessao}>
                <span className={styles.iconeSessao}>✓</span>
                {session.domainLabel}
              </div>
              <div className={styles.metricasSessao}>
                <span>{formatDuration(session.activityMs)}</span>
                <span className={styles.valorSessao}>{Math.round(session.co2eGrams)} g CO2e</span>
              </div>
            </div>
          ))
        ) : (
          <div className={styles.vazia}>Ainda não há sessões registradas neste período.</div>
        )}
      </div>

      <div className={styles.tendencia}>
        <div className={styles.tendenciaTexto}>
          {snapshot.trendPercentage >= 0 ? 'Seu uso aumentou' : 'Seu uso reduziu'}{' '}
          {Math.abs(snapshot.trendPercentage)}% neste período
        </div>
        <a
          href="https://gamarevista.uol.com.br/semana/vai-faltar-agua/como-usar-a-inteligencia/"
          target="_blank"
          rel="noreferrer"
          className={styles.botaoClaroBloco}
        >
          Ver Dicas para Reduzir Impacto
        </a>
        <div className={styles.acoes}>
          <button type="button" className={styles.botaoContorno} onClick={onExportData}>
            Exportar JSON
          </button>
          <button type="button" className={styles.botaoClaroAcao} onClick={onClearHistory}>
            Limpar Histórico
          </button>
        </div>
      </div>
    </section>
  );
}

export default HistoryView;
