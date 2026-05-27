import { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';
import PopupApp from './PopupApp.jsx';
import './modules/globalStyles.js';

ReactDOM.createRoot(document.getElementById('root')).render(
  <StrictMode>
    <PopupApp />
  </StrictMode>,
);
