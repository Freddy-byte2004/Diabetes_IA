import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../Componentes/AlertMessage";
import Logo from '../Logo2.jpeg';
import '../css/recuperarContrasena.css';
function SolicitarCodigo() {
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("error");
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("codigo_verificado");
    sessionStorage.removeItem("correo_verificado");
  }, []);

  async function enviarCodigo(e) {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await axios.post(
        "https://diabetes-ia-backend-1.onrender.com/api/auth/verify-code",
        {
          usuario: correo,
          codigo: codigo
        },
        {
          validateStatus: (status) => status < 500
        }
      );

      if (res.status === 200 && res.data?.message === "Código válido") {
        setTipoMensaje("success");
        setMensaje("Codigo correcto. Redirigiendo...");
        sessionStorage.setItem("codigo_verificado", "true");
        sessionStorage.setItem("correo_verificado", correo);

        setTimeout(() => {
          navigate("/verificar-codigo", { state: { correo } });
        }, 2500);
      } else if (res.status >= 400 && res.status < 500) {
        setTipoMensaje("error");
        setMensaje(res.data?.message || "Codigo invalido");
      } else {
        setTipoMensaje("error");
        setMensaje("Error al verificar el codigo");
      }
    } catch (err) {
      console.error(err);

      setTipoMensaje("error");
      setMensaje("Error al enviar codigo");
    }
  }

  return (
    <div className="Contenedor-principal-codigo">
  <AlertMessage message={mensaje} type={tipoMensaje} onClose={() => setMensaje("")} />
  <div className="Contenedor-codigo">
    <div className="logo-codigo">
      <img src={Logo} alt="Logo" />
    </div>
    <div className="titulo-codigo"><h1>Recuperar contraseña</h1></div>
    <form onSubmit={enviarCodigo}>
      <div className="input-codigo">
        <input type="text" placeholder="Ingrese su correo" value={correo} onChange={(e) => setCorreo(e.target.value)} />
      </div>
      <div className="input-codigo">
        <input type="text" placeholder="Ingrese su codigo unico" value={codigo} onChange={(e) => setCodigo(e.target.value)} />
      </div>
      <button type="submit" className="boton-codigo">Enviar código</button>
    </form>
    <div className="regresar-login" onClick={() => navigate("/login")}>
      <p>
        ¿Recordaste tu contraseña? Regresar al login
      </p>
    </div>
  </div>
</div>

  );
}

export default SolicitarCodigo;
