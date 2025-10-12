import { Routes, Route } from 'react-router-dom';
import Login from  './Pages/Login';
import UsuarioPrincipal from './Pages/UsuarioPrincipal';
import RegistroUsuario from './Pages/RegistroUsuario';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<UsuarioPrincipal />} />
      <Route path="/registro" element={<RegistroUsuario />} />
    </Routes>
  );
}

export default App;
