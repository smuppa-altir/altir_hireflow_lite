import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { applyThemeToDocument, resolveInitialTheme } from './utils/theme'
import './index.css'

applyThemeToDocument(resolveInitialTheme())

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
