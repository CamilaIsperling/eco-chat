import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import { textoApoio } from '../../modules/typographyStyles.js';
import { theme } from '../../modules/theme.js';

const styles = {
  wrapper: css({
    borderRadius: theme.bordas.xxl,
    border: `1px solid ${theme.cores.slate200}`,
    backgroundColor: theme.cores.white,
    padding: '20px 16px',
  }),
  titulo: css({
    marginBottom: '12px',
  }),
  barras: css({
    display: 'flex',
    alignItems: 'flex-end',
    gap: '16px',
    height: '112px',
  }),
  coluna: css({
    display: 'flex',
    flex: '1 1 0%',
    justifyContent: 'flex-end',
    height: '100%',
  }),
  barra: (height) =>
    css({
      width: '100%',
      height,
      borderRadius: theme.bordas.pill,
      backgroundColor: theme.cores.brand400,
    }),
};

function SessionChart({ responseMs }) {
  const points =
    responseMs.length > 0 ? responseMs : [18000, 12000, 22000, 16000];
  const maximum = Math.max(...points, 1);

  return (
    <div className={styles.wrapper}>
      <div className={classNames(textoApoio, styles.titulo)}>
        Evolução da Sessão
      </div>
      <div className={styles.barras}>
        {points.slice(-6).map((point, index) => (
          <div key={`chart-${index}`} className={styles.coluna}>
            <div
              className={styles.barra(
                `${Math.max(14, (point / maximum) * 90)}px`,
              )}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

export default SessionChart;
