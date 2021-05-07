import '@app/style/main.scss';
import * as React from 'react';
import { render } from 'react-dom';
import App from '@app/App';

const root = document.createElement('div');
root.classList.add('root');
document.body.appendChild(root);

render(<App />, root);
