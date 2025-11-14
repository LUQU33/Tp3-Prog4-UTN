import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// Estilos de Bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
// Resto de componentes
import App from './App.jsx'
import { AuthPage, AuthProvider, AuthRol } from './auth/Auth.jsx';



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
