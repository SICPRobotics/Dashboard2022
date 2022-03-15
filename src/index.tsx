import React from 'react';
import ReactDOM from 'react-dom';
import { App } from './app';
import { theme } from './theme';

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);

document.body.style.margin = '0px';
document.body.style.padding = '0px';
document.body.style.backgroundColor = theme.semidark;
document.body.style.fontFamily = 'sans-serif';
document.body.style.color = theme.light;

/*
const fakeCursor = document.createElement('div');
fakeCursor.style.width = '2px';
fakeCursor.style.height = '10px';

window.addEventListener('selectionchange', e => {
    window.getSelection()?.getRangeAt(0).insertNode(fakeCursor);
})*/