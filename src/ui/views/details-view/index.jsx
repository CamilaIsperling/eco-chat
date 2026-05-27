import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import DetailsRow from '../../components/details-row/index.jsx';
import { EDUCATIONAL_TIPS } from '../../../api/shared/constants.js';
import { formatDuration, getDomainLabel, roundTo } from '../../../api/shared/metrics.js';
import { textoApoio, tituloCompacto } from '../../modules/typographyStyles.js';
import { theme } from '../../modules/theme.js';

const styles = {
  painel: css({
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    height: '100%',
    padding: '16px',
    gap: '10px',
    borderRadius: theme.bordas.cartao,
    backgroundColor: theme.cores.white,
    boxShadow: theme.sombras.suave,
  }),
  cabecalho: css({
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  }),
  botaoVoltar: css({
    borderRadius: theme.bordas.xl,
    backgroundColor: theme.cores.slate100,
    padding: '6px 10px',
    color: theme.cores.slate500,
  }),
  avisoDominio: css({
    border: '1px solid #a7f3d0',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.emerald50,
    padding: '8px 12px',
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
    color: theme.cores.emerald700,
  }),
  cartaoInformativo: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.sky50,
    padding: '10px 12px',
  }),
  cartaoInformativoTitulo: css({}),
  listaDicas: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    padding: '0px',
    listStyle: 'none',
  }),
  itemDica: css({
    display: 'flex',
    alignItems: 'flex-start',
    gap: '8px',
    fontSize: '13px',
    lineHeight: '18px',
    color: theme.cores.ink,
  }),
  iconeDica: css({
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '18px',
    height: '18px',
    marginTop: '1px',
    borderRadius: theme.bordas.pill,
    backgroundColor: theme.cores.emerald500,
    color: theme.cores.white,
    fontSize: '11px',
    lineHeight: '14px',
    flexShrink: 0,
  }),
};

function DetailsView({ session, onBack }) {
  return (
    <section className={styles.painel}>
      <div className={styles.cabecalho}>
        <button type="button" className={styles.botaoVoltar} onClick={onBack}>
          ←
        </button>
        <div className={tituloCompacto}>Detalhes da Conversa</div>
      </div>

      <div className={styles.avisoDominio}>Chat detectado: {getDomainLabel(session.domain)}</div>

      <div style={{ border: '1px solid rgb(226, 232, 240)', borderRadius: '24px' }}>
        <DetailsRow
          label="Início da sessão"
          value={new Date(session.startedAt).toLocaleTimeString('pt-BR', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        />
        <DetailsRow label="Domínio" value={session.domain} />
        <DetailsRow label="Mensagens enviadas" value={session.sentMessages} />
        <DetailsRow label="Mensagens recebidas" value={session.receivedMessages} />
        <DetailsRow label="Tempo total" value={formatDuration(session.activityMs)} />
        <DetailsRow label="CO2 estimado" value={`${Math.round(session.metrics.co2eGrams)} g CO2e`} />
        <DetailsRow label="Energia consumida" value={`${roundTo(session.metrics.energyKWh, 2)} kWh`} />
      </div>

      <div className={styles.cartaoInformativo}>
        <div className={classNames(textoApoio, styles.cartaoInformativoTitulo)}>
          As estimativas são baseadas no uso observado.
        </div>
        <ul className={styles.listaDicas}>
          {EDUCATIONAL_TIPS.map((tip) => (
            <li key={tip} className={styles.itemDica}>
              <span className={styles.iconeDica}>✓</span>
              <span>{tip}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export default DetailsView;
