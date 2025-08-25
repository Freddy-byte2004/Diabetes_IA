import { Routes, Route } from 'react-router-dom';
import Login from  './Pages/Login';
import UsuarioPrincipal from './Pages/UsuarioPrincipal';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/dashboard" element={<UsuarioPrincipal />} />
    </Routes>
  );
}

export default App;
