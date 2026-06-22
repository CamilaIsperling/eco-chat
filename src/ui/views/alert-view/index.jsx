import { css } from 'glamor';
import { buildImpactSegments, getImpactMeta } from '../../../api/shared/metrics.js';
import { CORES_ALERTA } from '../../modules/popupConstants.js';
import { theme } from '../../modules/theme.js';

const styles = {
  painel: css({
    width: '100%',
    padding: '16px',
    overflow: 'hidden',
    borderRadius: theme.bordas.cartao,
    backgroundColor: theme.cores.white,
    boxShadow: theme.sombras.suave,
  }),
  marca: css({
    margin: '-16px -16px 0px',
    backgroundColor: theme.cores.brand500,
    padding: '12px 16px',
    textAlign: 'center',
    color: theme.cores.white,
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: '900',
  }),
  nivel: css({
    margin: '0px -16px',
    backgroundColor: theme.cores.red500,
    padding: '8px 16px',
    textAlign: 'center',
    color: theme.cores.white,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '800',
  }),
  conteudo: css({
    padding: '16px 0px 0px',
    textAlign: 'center',
  }),
  legenda: css({
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
    color: theme.cores.slate500,
  }),
  valor: css({
    marginTop: '8px',
    fontSize: '40px',
    lineHeight: '1',
    fontWeight: '900',
    color: theme.cores.ink,
  }),
  faixa: css({
    display: 'flex',
    gap: '8px',
    marginTop: '14px',
  }),
  segmento: (color) =>
    css({
      flex: '1 1 25%',
      minWidth: '0px',
      height: '14px',
      borderRadius: theme.bordas.pill,
      backgroundColor: color,
    }),
  impacto: (color) =>
    css({
      marginTop: '10px',
      fontSize: '16px',
      lineHeight: '24px',
      fontWeight: '700',
      color,
    }),
  descricao: css({
    marginTop: '6px',
    fontSize: '13px',
    lineHeight: '18px',
    color: theme.cores.slate500,
  }),
  acoes: css({
    display: 'flex',
    width: '100%',
    gap: '10px',
    marginTop: '16px',
    [theme.breakpoints.mobile]: {
      flexDirection: 'column',
    },
  }),
  botaoAlerta: css({
    flex: '1 1 50%',
    minWidth: '0px',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.red500,
    padding: '10px 14px',
    color: theme.cores.white,
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '800',
  }),
  botaoSecundario: css({
    flex: '1 1 50%',
    minWidth: '0px',
    borderRadius: theme.bordas.xxl,
    border: `1px solid ${theme.cores.slate200}`,
    backgroundColor: theme.cores.white,
    padding: '10px 14px',
    color: theme.cores.slate500,
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '700',
  }),
};

function AlertView({ session, onDismiss }) {
  const meta = getImpactMeta(session.metrics.impactLevel);

  return (
    <section className={styles.painel}>
      <div className={styles.marca}>EcoChatGPT</div>
      <div className={styles.nivel}>Alerta de {meta.label} Impacto</div>

      <div className={styles.conteudo}>
        <div className={styles.legenda}>Estimado na conversa</div>
        <div className={styles.valor}>{Math.round(session.metrics.co2eGrams)} g CO2e</div>

        <div className={styles.faixa}>
          {buildImpactSegments(session.metrics.co2eGrams).map((segment, index) => (
            <div
              key={`alert-${index}`}
              className={styles.segmento(segment.active ? CORES_ALERTA[index] : theme.cores.slate100)}
            />
          ))}
        </div>

        <div className={styles.impacto(meta.accentHex)}>Nível de Impacto: {meta.label}</div>
        <div className={styles.descricao}>
          Esta sessão atingiu um nível elevado de impacto ambiental.
        </div>

        <div className={styles.acoes}>
          <button type="button" className={styles.botaoAlerta} onClick={onDismiss}>
            Reduzir Atividade
          </button>
          <button type="button" className={styles.botaoSecundario} onClick={onDismiss}>
            Continuar Mesmo Assim
          </button>
        </div>
      </div>
    </section>
  );
}

export default AlertView;
