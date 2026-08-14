import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import './tachyons-used.css'
import Article from './Article.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Article />
  </StrictMode>,
)
