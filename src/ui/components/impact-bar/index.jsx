import { css } from 'glamor';
import {
  buildImpactSegments,
  getImpactMeta,
  roundTo,
} from '../../../api/shared/metrics.js';
import { CORES_IMPACTO } from '../../modules/popupConstants.js';
import { theme } from '../../modules/theme.js';

const styles = {
  wrapper: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    gap: '10px',
    padding: '12px 12px 0',
  }),
  cabecalho: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
    color: theme.cores.ink,
  }),
  faixa: css({
    display: 'flex',
    gap: '6px',
  }),
  segmento: (color) =>
    css({
      flex: '1 1 25%',
      minWidth: '0px',
      height: '12px',
      borderRadius: theme.bordas.pill,
      backgroundColor: color,
    }),
  seloArea: css({
    display: 'flex',
    justifyContent: 'center',
  }),
  selo: (color) =>
    css({
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: theme.bordas.pill,
      padding: '3px 14px',
      fontSize: '13px',
      lineHeight: '18px',
      fontWeight: '700',
      color: color,
      backgroundColor: theme.cores.white,
    }),
};

function ImpactBar({ session }) {
  const segments = buildImpactSegments(session.metrics.co2eGrams);
  const meta = getImpactMeta(session.metrics.impactLevel);

  return (
    <div className={styles.wrapper}>
      <div className={styles.cabecalho}>
        <span>Água</span>
        <span>{roundTo(session.metrics.waterLiters, 1)} L</span>
      </div>
      <div className={styles.faixa}>
        {segments.map((segment, index) => (
          <div
            key={segment.key}
            className={styles.segmento(
              segment.active
                ? CORES_IMPACTO[index]
                : 'rgba(255, 255, 255, 0.12)',
            )}
          />
        ))}
      </div>
      <div className={styles.seloArea}>
        <span className={styles.selo(meta.accentHex)}>{meta.label}</span>
      </div>
    </div>
  );
}

export default ImpactBar;
