/* eslint-disable no-undef */
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import Popup from './Popup';

browser.runtime.sendMessage({ data: 'hello' });

ReactDOM.render(<Popup text="Mah Amigos" />, document.getElementById('root'));

