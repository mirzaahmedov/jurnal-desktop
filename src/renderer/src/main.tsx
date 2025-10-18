import { StrictMode } from 'react'

import 'allotment/dist/style.css'
import { createRoot } from 'react-dom/client'
import 'video-react/dist/video-react.css'

import '@/common/lib/http'

import App from './App'
import './main.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
