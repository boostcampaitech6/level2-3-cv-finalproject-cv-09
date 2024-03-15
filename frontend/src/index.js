import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import {MakingProvider, NameProvider} from './context';

const root = ReactDOM.createRoot(document.getElementById('__next'));
root.render(
  // <NameProvider>
  <MakingProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </MakingProvider>
  // </NameProvider>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
