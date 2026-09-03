import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App.tsx';
import './styles/tokens.css';
import './styles/base.css';

const container = document.getElementById('root');

if (container === null) {
	throw new Error('Unable to start: #root is missing from the document.');
}

createRoot(container).render(
	<StrictMode>
		<App />
	</StrictMode>,
);
