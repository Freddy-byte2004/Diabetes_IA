import { useEffect, useState } from "react";
import { changePassword } from "../services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import AlertMessage from "../Componentes/AlertMessage";
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import Logo from '../Logo2.jpeg';
import '../css/recuperarContrasena.css';
function VerificarCodigo() {
  const location = useLocation();
  const [nuevaContrasena, setNuevaContrasena] = useState("");
  const [correo] = useState(location.state?.correo || sessionStorage.getItem("correo_verificado") || "");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("error");
  const [showPassword, setShowPassword] = useState(false);
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
      const res = await changePassword({ usuario: correo, nuevaContrasena });

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
        <div className="password-input-wrap">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Ingrese la nueva contraseña"
            value={nuevaContrasena}
            onChange={(e) => setNuevaContrasena(e.target.value)}
          />
          <button
            type="button"
            className="toggle-password-btn"
            onClick={() => setShowPassword(s => !s)}
            aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
            title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
          >
            {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </button>
        </div>
      </div>
      
      <button type="submit" className="boton-codigo">Enviar</button>
    </form>
  </div>
</div>

  );
}

export default VerificarCodigo;
