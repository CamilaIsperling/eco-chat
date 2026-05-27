import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import { textoRotulo } from '../../modules/typographyStyles.js';
import { theme } from '../../modules/theme.js';

const styles = {
  cartao: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    flex: '1 1 calc(50% - 6px)',
    border: `1px solid ${theme.cores.slate200}`,
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.white,
    padding: '16px',
    boxShadow: theme.sombras.leve,
  }),
  rotulo: css({
    color: theme.cores.slate400,
  }),
  valor: css({
    fontSize: '30px',
    lineHeight: '36px',
    fontWeight: '900',
    color: theme.cores.ink,
  }),
};

function HistoryCard({ label, value }) {
  return (
    <div className={styles.cartao}>
      <div className={classNames(textoRotulo, styles.rotulo)}>{label}</div>
      <div className={styles.valor}>{value}</div>
    </div>
  );
}

export default HistoryCard;
