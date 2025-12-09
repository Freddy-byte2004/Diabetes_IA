import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import UsuarioPrincipal from './Pages/UsuarioPrincipal';
import RegistroUsuario from './Pages/RegistroUsuario';
import Perfil from './Pages/Perfil';
import PrivateRoute from './Componentes/privateRoute';
import Historial from './Pages/Historial';
import OlvidoContrasena from './Pages/OlvidoContrasena';
import SolicitarCodigo from './Pages/SolicitarCodigo';
import VerificarCodigo from './Pages/VerificarCodigo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<UsuarioPrincipal />} />
      <Route path="/registro" element={<RegistroUsuario />} />
      <Route path="/olvido-contrasena" element={<OlvidoContrasena />} />
        <Route path="/solicitar-codigo" element={<SolicitarCodigo />} />
          <Route path="/verificar-codigo" element={<VerificarCodigo />} />
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      <Route path="/historial" element={<PrivateRoute><Historial /></PrivateRoute>} />
    </Routes>
  );  
}

export default App;
