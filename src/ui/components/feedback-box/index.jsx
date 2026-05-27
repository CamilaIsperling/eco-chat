import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import { tituloCompacto, textoApoio } from '../../modules/typographyStyles.js';
import { theme } from '../../modules/theme.js';

const styles = {
  caixa: css({
    borderRadius: theme.bordas.cartao,
    backgroundColor: theme.cores.white,
    boxShadow: theme.sombras.suave,
    padding: '32px 32px',
    textAlign: 'center',
  }),
  titulo: css({
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: '700',
  }),
  tituloErro: css({
    color: theme.cores.red500,
  }),
  texto: css({
    margin: '12px 0px 0px',
    fontWeight: '400',
  }),
};

function FeedbackBox({ title, message, isError = false }) {
  return (
    <div className={styles.caixa}>
      <div
        className={classNames(
          tituloCompacto,
          styles.titulo,
          isError && styles.tituloErro,
        )}
      >
        {title}
      </div>
      {message ? (
        <p className={classNames(textoApoio, styles.texto)}>{message}</p>
      ) : null}
    </div>
  );
}

export default FeedbackBox;
