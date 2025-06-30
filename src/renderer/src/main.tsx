import { StrictMode } from 'react'

import 'allotment/dist/style.css'
import { createRoot } from 'react-dom/client'
import 'video-react/dist/video-react.css'

import App from './app'
import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
