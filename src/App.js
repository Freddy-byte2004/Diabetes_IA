import { HashRouter, Routes, Route } from 'react-router-dom';
import Login from './Pages/Login';
import UsuarioPrincipal from './Pages/UsuarioPrincipal';
import RegistroUsuario from './Pages/RegistroUsuario';

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<UsuarioPrincipal />} />
        <Route path="/registro" element={<RegistroUsuario />} />
      </Routes>
    </HashRouter>
  );
}

export default App;
