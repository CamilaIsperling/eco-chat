import { css } from 'glamor';
import { theme } from '../../modules/theme.js';

const styles = {
  painel: css({
    width: '100%',
    padding: '32px 32px',
    borderRadius: theme.bordas.cartao,
    backgroundColor: theme.cores.white,
    boxShadow: theme.sombras.suave,
    textAlign: 'center',
    [theme.breakpoints.tablet]: {
      padding: '24px 20px',
    },
    [theme.breakpoints.mobile]: {
      padding: '16px',
    },
  }),
  icone: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '64px',
    height: '64px',
    margin: '0px auto',
    borderRadius: theme.bordas.pill,
    backgroundColor: theme.cores.brand100,
    color: theme.cores.brand500,
    fontSize: '30px',
    lineHeight: '36px',
  }),
  titulo: css({
    marginTop: '20px',
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: '900',
    color: theme.cores.ink,
  }),
  texto: css({
    margin: '12px 0px 0px',
    fontSize: '14px',
    lineHeight: '24px',
    color: theme.cores.slate500,
  }),
  botao: css({
    marginTop: '24px',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.brand400,
    padding: '14px 20px',
    color: theme.cores.white,
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: '700',
    transition: 'background-color 180ms ease, transform 180ms ease',
    ':hover': {
      backgroundColor: theme.cores.brand300,
      transform: 'translateY(-1px)',
    },
  }),
};

function EmptyState({ onOpenSettings }) {
  return (
    <section className={styles.painel}>
      <div className={styles.icone}>🍃</div>
      <div className={styles.titulo}>Nenhuma conversa ativa agora</div>
      <p className={styles.texto}>
        Abra o ChatGPT em uma aba do Chrome para começar a coletar mensagens, tempos de resposta e
        estimativas ambientais da conversa.
      </p>
      <button type="button" className={styles.botao} onClick={onOpenSettings}>
        Abrir configurações
      </button>
    </section>
  );
}

export default EmptyState;
