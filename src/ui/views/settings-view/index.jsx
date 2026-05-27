import { css } from 'glamor';
import classNames from '../../modules/classNames.js';
import Toggle from '../../components/toggle/index.jsx';
import { formatarDataHora } from '../../modules/formatters.js';
import { tituloSecao } from '../../modules/typographyStyles.js';
import { theme } from '../../modules/theme.js';

const styles = {
  painel: css({
    flex: 1,
    minHeight: 0,
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    width: '100%',
    padding: '16px',
    gap: '12px',
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
  cartaoConfiguracao: css({
    border: `1px solid ${theme.cores.slate200}`,
    borderRadius: theme.bordas.painel,
  }),
  tituloBloco: css({
    padding: '10px 16px',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '800',
    color: theme.cores.ink,
    borderBottom: `1px solid ${theme.cores.slate200}`,
  }),
  tituloBlocoSeparado: css({
    borderTop: `1px solid ${theme.cores.slate200}`,
  }),
  linha: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    padding: '10px 16px',
    borderBottom: `1px solid ${theme.cores.slate200}`,
    [theme.breakpoints.mobile]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  }),
  linhaFinal: css({
    borderBottom: '0px',
    paddingBottom: '12px',
  }),
  textoLinha: css({
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
    color: theme.cores.ink,
  }),
  grupo: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    padding: '10px 16px',
  }),
  grupoEspacoso: css({
    gap: '10px',
  }),
  linhaConfiguracao: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
    fontSize: '13px',
    lineHeight: '18px',
    color: theme.cores.ink,
    [theme.breakpoints.mobile]: {
      flexDirection: 'column',
      alignItems: 'stretch',
    },
  }),
  linhaConfiguracaoInativa: css({
    color: theme.cores.slate400,
  }),
  rotuloConfiguracao: css({
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  }),
  marcadorSuave: css({
    display: 'inline-block',
    width: '12px',
    height: '12px',
    borderRadius: theme.bordas.pill,
    backgroundColor: theme.cores.emerald100,
  }),
  labelForte: css({
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '800',
    color: theme.cores.ink,
  }),
  select: css({
    border: `1px solid ${theme.cores.slate200}`,
    borderRadius: theme.bordas.xxl,
    padding: '8px 12px',
    backgroundColor: theme.cores.white,
    color: theme.cores.slate600,
    fontSize: '13px',
    lineHeight: '18px',
    fontWeight: '600',
    outline: 'none',
    ':focus': {
      borderColor: theme.cores.brand400,
    },
  }),
  cartaoStatus: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
    border: `1px solid ${theme.cores.slate200}`,
    borderRadius: theme.bordas.painel,
    backgroundColor: theme.cores.slate50,
    padding: '12px 16px',
  }),
  tituloStatus: css({
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '800',
    color: theme.cores.ink,
  }),
  listaStatus: css({
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
    fontSize: '12px',
    lineHeight: '18px',
    color: theme.cores.slate600,
  }),
  linhaStatus: css({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '16px',
  }),
  valorStatus: css({
    fontWeight: '600',
    color: theme.cores.ink,
    textAlign: 'right',
  }),
  valorStatusTruncado: css({
    maxWidth: '180px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  }),
  botaoPrincipal: css({
    width: '100%',
    borderRadius: theme.bordas.xxl,
    backgroundColor: theme.cores.brand400,
    padding: '10px 16px',
    color: theme.cores.white,
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: '700',
    transition: 'background-color 180ms ease, transform 180ms ease',
    ':hover': {
      backgroundColor: theme.cores.brand300,
      transform: 'translateY(-1px)',
    },
  }),
};

function SettingsView({ settings, status, onBack, onRefresh, onUpdateSettings }) {
  return (
    <section className={styles.painel}>
      <div className={styles.cabecalho}>
        <button type="button" className={styles.botaoVoltar} onClick={onBack}>
          ←
        </button>
        <div className={tituloSecao}>Configurações</div>
      </div>

      <div className={styles.cartaoConfiguracao}>
        <div className={styles.tituloBloco}>Monitoramento</div>

        <div className={styles.linha}>
          <div className={styles.textoLinha}>Ativar detecção automática</div>
          <Toggle
            checked={settings.monitoring.autoDetect}
            onChange={(checked) => onUpdateSettings({ monitoring: { autoDetect: checked } })}
          />
        </div>

        <div className={styles.grupo}>
          <div className={styles.linhaConfiguracao}>
            <div className={styles.rotuloConfiguracao}>
              <input type="checkbox" checked readOnly />
              <span>ChatGPT</span>
            </div>
            <Toggle
              checked={settings.monitoring.domains.chatgpt}
              onChange={(checked) =>
                onUpdateSettings({ monitoring: { domains: { chatgpt: checked } } })
              }
            />
          </div>

          <div className={classNames(styles.linhaConfiguracao, styles.linhaConfiguracaoInativa)}>
            <div className={styles.rotuloConfiguracao}>
              <input type="checkbox" disabled />
              <span>Gemini (próxima fase)</span>
            </div>
            <Toggle checked={false} onChange={() => {}} disabled />
          </div>

          <div className={classNames(styles.linhaConfiguracao, styles.linhaConfiguracaoInativa)}>
            <div className={styles.rotuloConfiguracao}>
              <input type="checkbox" disabled />
              <span>Copilot (próxima fase)</span>
            </div>
            <Toggle checked={false} onChange={() => {}} disabled />
          </div>
        </div>

        <div className={classNames(styles.tituloBloco, styles.tituloBlocoSeparado)}>
          Preferências de Alerta
        </div>

        <div className={classNames(styles.grupo, styles.grupoEspacoso)}>
          <div className={styles.linhaConfiguracao}>
            <div className={styles.rotuloConfiguracao}>
              <span className={styles.marcadorSuave} />
              <span>Mostrar badge no ícone</span>
            </div>
            <Toggle
              checked={settings.alerts.showBadge}
              onChange={(checked) => onUpdateSettings({ alerts: { showBadge: checked } })}
            />
          </div>

          <div className={styles.linhaConfiguracao}>
            <div className={styles.rotuloConfiguracao}>
              <span className={styles.marcadorSuave} />
              <span>Exibir alertas de impacto</span>
            </div>
            <Toggle
              checked={settings.alerts.showImpactAlerts}
              onChange={(checked) => onUpdateSettings({ alerts: { showImpactAlerts: checked } })}
            />
          </div>
        </div>

        <div className={classNames(styles.linha, styles.linhaFinal)}>
          <span className={styles.labelForte}>Unidade Principal:</span>
          <select
            className={styles.select}
            value={settings.primaryUnit}
            onChange={(event) => onUpdateSettings({ primaryUnit: event.target.value })}
          >
            <option value="co2e">CO2e</option>
            <option value="energy">kWh</option>
          </select>
        </div>
      </div>

      <div className={styles.cartaoStatus}>
        <div className={styles.tituloStatus}>Status da validação</div>
        <div className={styles.listaStatus}>
          <div className={styles.linhaStatus}>
            <span>Aba monitorada</span>
            <span className={styles.valorStatus}>{status.monitoringCurrentTab ? 'Sim' : 'Não'}</span>
          </div>
          <div className={styles.linhaStatus}>
            <span>Domínio atual</span>
            <span className={classNames(styles.valorStatus, styles.valorStatusTruncado)}>
              {status.activeTabUrl || '-'}
            </span>
          </div>
          <div className={styles.linhaStatus}>
            <span>Última atualização</span>
            <span className={styles.valorStatus}>{formatarDataHora(status.lastSyncAt)}</span>
          </div>
          <div className={styles.linhaStatus}>
            <span>Sessão ativa</span>
            <span className={classNames(styles.valorStatus, styles.valorStatusTruncado)}>
              {status.activeSessionId || '-'}
            </span>
          </div>
        </div>

        <button type="button" className={styles.botaoPrincipal} onClick={onRefresh}>
          Recarregar status
        </button>
      </div>
    </section>
  );
}

export default SettingsView;
