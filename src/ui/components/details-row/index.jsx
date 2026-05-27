import { css } from 'glamor';
import { theme } from '../../modules/theme.js';

const styles = {
  linha: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '12px',
    borderBottom: `1px solid ${theme.cores.slate200}`,
    padding: '12px',
    fontSize: '15px',
    lineHeight: '20px',
    ':last-child': { borderBottom: 'none' },
  }),
  rotulo: css({
    color: theme.cores.slate500,
  }),
  valor: css({
    fontWeight: '600',
    color: theme.cores.ink,
    textAlign: 'right',
  }),
};

function DetailsRow({ label, value }) {
  return (
    <div className={styles.linha}>
      <span className={styles.rotulo}>{label}</span>
      <span className={styles.valor}>{value}</span>
    </div>
  );
}

export default DetailsRow;
