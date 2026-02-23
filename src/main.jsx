import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './contexts/AuthContext.jsx'
import { LMSProvider } from './contexts/LMSContext.jsx'
import { ToastProvider } from './contexts/ToastContext.jsx'
import { seedIfEmpty, migrateUserPasswords } from './utils/seed.js'

seedIfEmpty()
migrateUserPasswords()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <LMSProvider>
        <ToastProvider>
          <App />
        </ToastProvider>
      </LMSProvider>
    </AuthProvider>
  </StrictMode>,
)
