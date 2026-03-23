import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import AlertMessage from "../Componentes/AlertMessage";
import Logo from '../Logo2.jpeg';
import '../css/recuperarContrasena.css';
function VerificarCodigo() {
  const location = useLocation();
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [correo] = useState(location.state?.correo || sessionStorage.getItem("correo_verificado") || "");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("error");
  const navigate = useNavigate();

  useEffect(() => {
    const codigoVerificado = sessionStorage.getItem("codigo_verificado") === "true";
    const correoVerificado = sessionStorage.getItem("correo_verificado");

    if (!codigoVerificado || !correoVerificado) {
      navigate("/solicitar-codigo", { replace: true });
    }
  }, [navigate]);
  

  async function verificar(e) {
    e.preventDefault();
    setMensaje("");

    try {
      const res = await axios.post(
        "https://diabetes-ia-backend-1.onrender.com/api/auth/change-password",
        {
          usuario: correo,
          nuevaContrasena: nuevaContrasena
        },
        {
          validateStatus: (status) => status < 500
        }
      );

      if (res.status === 200 && res.data?.message === "Contraseña cambiada exitosamente") {
        setTipoMensaje("success");
        setMensaje("Contraseña cambiada exitosamente. Redirigiendo...");
        sessionStorage.removeItem("codigo_verificado");
        sessionStorage.removeItem("correo_verificado");

        setTimeout(() => {
          navigate("/login");
        }, 2500);
      } else if (res.status >= 400 && res.status < 500) {
        setTipoMensaje("error");
        setMensaje(res.data?.message || "Correo invalido");
      } else {
        setTipoMensaje("error");
        setMensaje("Error al cambiar la contraseña");
      }
    } catch (err) {
      console.error(err);
      setTipoMensaje("error");
      setMensaje("Error al verificar codigo");
    }
  }

  return (
    <div className="Contenedor-principal-codigo">
  <AlertMessage message={mensaje} type={tipoMensaje} onClose={() => setMensaje("")} />
  <div className="Contenedor-codigo contenedor-codigo-slide-in">
    <div className="logo-codigo">
      <img src={Logo} alt="Logo" />
    </div>
    <div className="titulo-codigo"><h1>Cambiar contraseña</h1></div>
    <form onSubmit={verificar}>
     
      <div className="input-codigo">
        <input type="password" placeholder="Ingrese la nueva contraseña" value={nuevaContrasena} onChange={(e) => setNuevaContrasena(e.target.value)} />
      </div>
      
      <button type="submit" className="boton-codigo">Enviar</button>
    </form>
  </div>
</div>

  );
}

export default VerificarCodigo;
