import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import { theme } from '../../modules/theme.js';

const styles = {
  banner: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: theme.bordas.pill,
    padding: '8px 12px',
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
    textAlign: 'center',
  }),
  ativo: css({
    backgroundColor: theme.cores.brand700,
    color: theme.cores.white,
  }),
  inativo: css({
    backgroundColor: theme.cores.slate200,
    color: theme.cores.slate600,
  }),
  ponto: css({
    display: 'inline-block',
    width: '8px',
    height: '8px',
    marginRight: '8px',
    borderRadius: theme.bordas.pill,
    backgroundColor: 'currentColor',
    opacity: 0.8,
  }),
};

function MonitoringBanner({ isMonitoring }) {
  return (
    <div
      className={classNames(
        styles.banner,
        isMonitoring ? styles.ativo : styles.inativo,
      )}
    >
      <span className={styles.ponto} />
      {isMonitoring
        ? 'Monitorando esta página'
        : 'Abra o ChatGPT para iniciar o monitoramento'}
    </div>
  );
}

export default MonitoringBanner;
