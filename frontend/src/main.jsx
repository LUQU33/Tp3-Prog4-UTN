import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom';
// Estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Resto de componentes
import App from './App.jsx'
import { AuthProvider } from './features/auth/Auth.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
)
