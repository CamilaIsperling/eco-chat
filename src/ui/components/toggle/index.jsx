import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import { theme } from '../../modules/theme.js';

const styles = {
  controle: css({
    display: 'inline-flex',
    alignItems: 'center',
    width: '56px',
    height: '28px',
    borderRadius: theme.bordas.pill,
    backgroundColor: theme.cores.slate200,
    padding: '0px',
    transition: 'background-color 180ms ease, opacity 180ms ease',
  }),
  ativo: css({
    backgroundColor: theme.cores.brand400,
  }),
  desabilitado: css({
    cursor: 'not-allowed',
    opacity: 0.5,
  }),
  bola: css({
    display: 'inline-block',
    width: '20px',
    height: '20px',
    marginLeft: '4px',
    borderRadius: theme.bordas.pill,
    backgroundColor: theme.cores.white,
    boxShadow: theme.sombras.pequena,
    transition: 'transform 180ms ease',
  }),
  bolaAtiva: css({
    transform: 'translateX(28px)',
  }),
};

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      type="button"
      className={classNames(
        styles.controle,
        checked && styles.ativo,
        disabled && styles.desabilitado,
      )}
      onClick={() => !disabled && onChange(!checked)}
      disabled={disabled}
    >
      <span className={classNames(styles.bola, checked && styles.bolaAtiva)} />
    </button>
  );
}

export default Toggle;
