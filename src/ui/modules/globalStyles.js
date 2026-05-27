import { css } from 'glamor';
import { theme } from './theme.js';

css.global('*, *::before, *::after', {
  boxSizing: 'border-box',
});

css.global(':root', {
  color: theme.cores.ink,
  fontFamily: "'Trebuchet MS', 'Segoe UI', sans-serif",
  fontSynthesis: 'none',
  textRendering: 'optimizeLegibility',
  WebkitFontSmoothing: 'antialiased',
  MozOsxFontSmoothing: 'grayscale',
});

css.global('body', {
  margin: '0px',
  width: '550px',
  height: '600px',
  overflow: 'hidden',
  backgroundColor: theme.cores.brand600,
  borderRadius: theme.bordas.cartao,
});

css.global('button, input, select', {
  font: 'inherit',
});

css.global('button', {
  border: '0px',
  cursor: 'pointer',
});
