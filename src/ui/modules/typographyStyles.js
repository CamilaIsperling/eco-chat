import { css } from 'glamor';
import { theme } from './theme.js';

const tipografiaBase = {
  fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
  fontStyle: 'normal',
};

export const textoCorpo = css({
  ...tipografiaBase,
  color: theme.cores.ink,
  fontSize: '14px',
  fontWeight: '400',
  lineHeight: '20px',
});

export const textoApoio = css({
  ...tipografiaBase,
  color: theme.cores.slate500,
  fontSize: '14px',
  fontWeight: '600',
  lineHeight: '20px',
});

export const textoRotulo = css({
  ...tipografiaBase,
  color: theme.cores.slate600,
  fontSize: '12px',
  fontWeight: '600',
  lineHeight: '16px',
  letterSpacing: '0.03em',
  textTransform: 'uppercase',
});

export const tituloSecao = css({
  ...tipografiaBase,
  color: theme.cores.slate500,
  fontSize: '30px',
  fontWeight: '900',
  lineHeight: '40px',
  [theme.breakpoints.mobile]: {
    fontSize: '28px',
    lineHeight: '32px',
  },
});

export const tituloCompacto = css({
  ...tipografiaBase,
  color: theme.cores.ink,
  fontSize: '15px',
  fontWeight: '800',
  lineHeight: '20px',
});

export const tituloHero = css({
  ...tipografiaBase,
  color: theme.cores.brand500,
  fontSize: '20px',
  fontWeight: '800',
  lineHeight: '28px',
});

export const valorHero = css({
  ...tipografiaBase,
  fontSize: '48px',
  fontWeight: '900',
  lineHeight: '1',
});
