import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import 'aos/dist/aos.css'
import 'flag-icons/css/flag-icons.min.css'
import '@drobinetm/react-countries-flags/styles'
import './app.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
