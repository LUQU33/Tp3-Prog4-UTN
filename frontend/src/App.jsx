import { Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { AuthPage } from './features/auth/Auth.jsx';
// Paginas
import { HomePage } from './pages/HomePage.jsx';
import { Alumnos } from './features/alumnos/Alumnos.jsx';
import { Materias } from './features/materias/Materias.jsx';
import { Notas } from './features/notas/Notas.jsx';
import { NotFoundPage } from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      {/* --- Rutas Públicas y Layout --- */}
      <Route path='/' element={<Layout />}>

        {/* Ruta índice (homepage) */}
        <Route index element={<HomePage />} />

        {/* --- Rutas Protegidas --- */}
        <Route
          path='alumnos'
          element={
            <AuthPage>
              <Alumnos />
            </AuthPage>
          }
        />
        
        <Route
          path='materias'
          element={
            <AuthPage>
              <Materias />
            </AuthPage>
          }
        />
        
        <Route
          path='notas'
          element={
            <AuthPage>
              <Notas />
            </AuthPage>
          }
        />

        {/* Ruta "Catch-all" para 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}

export default App
