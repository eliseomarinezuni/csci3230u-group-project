import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router' //AI ASSISTED
import App from './App.jsx'
import './styles/Recommendedstyles.css'
import './styles/root.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>{/* //AI ASSISTED */}
      <App />{/* //AI ASSISTED */}
    </BrowserRouter>{/* //AI ASSISTED */}
  </StrictMode>,
)
