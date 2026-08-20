import { StrictMode } from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import './index.css'
import './tachyons-used.css'
import Article from './Article.jsx'

const root = document.getElementById('root')
const article = (
  <StrictMode>
    <Article />
  </StrictMode>
)

if (root.hasChildNodes()) {
  hydrateRoot(root, article)
} else {
  createRoot(root).render(article)
}
