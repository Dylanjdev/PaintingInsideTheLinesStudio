import React, { StrictMode } from 'react';
import { renderToString } from 'react-dom/server';
import App from './App.jsx';
import Article from './Article.jsx';

export function renderHome() {
  return renderToString(
    <StrictMode>
      <App />
    </StrictMode>
  );
}

export function renderArticle() {
  return renderToString(
    <StrictMode>
      <Article />
    </StrictMode>
  );
}
