import { StrictMode } from 'react'

import { createRoot } from 'react-dom/client'
import 'video-react/dist/video-react.css'

import App from './App'
import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
