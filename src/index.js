import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import TestBoard from "./TestBoard";
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<TestBoard />, document.getElementById('root'));

serviceWorker.unregister();
