import * as React from 'react';
import * as ReactDOM from 'react-dom';
import App from './App';

const TokenInput = () => ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('token-input')
)

export default TokenInput