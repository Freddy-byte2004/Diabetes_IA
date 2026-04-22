import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import UsuarioPrincipal from './Pages/UsuarioPrincipal';
import RegistroUsuario from './Pages/RegistroUsuario';
import Perfil from './Pages/Perfil';
import PrivateRoute from './Componentes/privateRoute';
import Historial from './Pages/Historial';
import Pacientes from './Pages/Pacientes';
import Landing from './Pages/Landing';

import SolicitarCodigo from './Pages/SolicitarCodigo';
import VerificarCodigo from './Pages/VerificarCodigo';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
     
      <Route path="/registro" element={<RegistroUsuario />} />
        <Route path="/solicitar-codigo" element={<SolicitarCodigo />} />
          <Route path="/verificar-codigo" element={<VerificarCodigo />} />
           <Route path="/dashboard" element={<PrivateRoute><UsuarioPrincipal /></PrivateRoute>} />
      <Route path="/perfil" element={<PrivateRoute><Perfil /></PrivateRoute>} />
      <Route path="/historial" element={<PrivateRoute><Historial /></PrivateRoute>} />
      <Route path="/pacientes" element={<PrivateRoute><Pacientes /></PrivateRoute>} />
    </Routes>
  );  
}

export default App;
