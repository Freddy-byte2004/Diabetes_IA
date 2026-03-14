import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logo from '../Logo2.jpeg';
import '../css/recuperarContrasena.css';
function SolicitarCodigo() {
  const [correo, setCorreo] = useState("");
  const navigate = useNavigate();

  async function enviarCodigo(e) {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:3000/api/auth/forgot-password", {
        usuario: correo,
      });

      if (res.data.message === "Código enviado al correo") {
        alert("Código enviado a tu correo");
        navigate("/verificar-codigo", { state: { correo } });
      } else {
        alert("Correo no registrado");
      }
    } catch (err) {
      console.error(err);
      alert("Error al enviar código");
    }
  }

  return (
    <div className="Contenedor-principal-codigo">
  <div className="Contenedor-codigo">
    <div className="logo-codigo">
      <img src={Logo} alt="Logo" />
    </div>
    <div className="titulo-codigo"><h1>Recuperar contraseña</h1></div>
    <form onSubmit={enviarCodigo}>
      <div className="input-codigo">
        <input type="email" placeholder="Ingrese su correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </div>
      <button type="submit" className="boton-codigo">Enviar código</button>
    </form>
  </div>
</div>

  );
}

export default SolicitarCodigo;
