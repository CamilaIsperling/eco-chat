import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import { textoRotulo } from '../../modules/typographyStyles.js';
import { theme } from '../../modules/theme.js';

const styles = {
  chip: css({
    flex: '1 1 0%',
    minWidth: '0px',
    borderRadius: theme.bordas.xxl,
    padding: '8px 10px',
    backgroundColor: 'transparent',
    color: theme.cores.ink,
    textAlign: 'center',
  }),
  destacado: css({
    backgroundColor: theme.cores.white,
    boxShadow: theme.sombras.leve,
  }),
  rotulo: css({}),
  valor: css({
    marginTop: '4px',
    fontSize: '20px',
    lineHeight: '26px',
    fontWeight: '800',
  }),
};

function MetricChip({ label, value, highlighted }) {
  return (
    <div className={classNames(styles.chip, highlighted && styles.destacado)}>
      <div className={classNames(textoRotulo, styles.rotulo)}>{label}</div>
      <div className={styles.valor}>{value}</div>
    </div>
  );
}

export default MetricChip;
