import React from 'react';
import ReactDOM from 'react-dom';
import ChessGame from "./ChessGame";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<ChessGame />, document.getElementById('root'));

serviceWorker.unregister();
