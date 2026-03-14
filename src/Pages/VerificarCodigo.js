import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from '../Logo2.jpeg';
import '../css/recuperarContrasena.css';
function VerificarCodigo() {
  const [codigo, setCodigo] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const correo = location.state?.correo; // correo pasado desde SolicitarCodigo

  async function verificar(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/verificar-codigo", {
        usuario: correo,
        codigo,
      });

      if (res.data.message === "Código válido") {
        alert("Código correcto");
        navigate("/olvido-contrasena", { state: { correo } });
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      console.error(err);
      alert("Error al verificar código");
    }
  }

  return (
    <div className="Contenedor-principal-codigo">
  <div className="Contenedor-codigo">
    <div className="logo-codigo">
      <img src={Logo} alt="Logo" />
    </div>
    <div className="titulo-codigo"><h1>Verificar código</h1></div>
    <form onSubmit={verificar}>
      <div className="input-codigo">
        <input type="text" placeholder="Ingrese el código recibido" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
      </div>
      <button type="submit" className="boton-codigo">Verificar</button>
    </form>
  </div>
</div>

  );
}

export default VerificarCodigo;
