import { Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import UsuarioPrincipal from './Pages/UsuarioPrincipal';
import RegistroUsuario from './Pages/RegistroUsuario';
import PrivateRoute from './Componentes/privateRoute';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<PrivateRoute><UsuarioPrincipal /></PrivateRoute>} />
      <Route path="/registro" element={<RegistroUsuario />} />
    </Routes>
  );
}

export default App;
