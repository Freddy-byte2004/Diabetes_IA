import { useEffect, useState } from "react";
import { requestNewCode, verifyCode } from "../services/authService";
import { useNavigate } from "react-router-dom";
import AlertMessage from "../Componentes/AlertMessage";
import Logo from '../Logo2.jpeg';
import '../css/recuperarContrasena.css';

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60).toString().padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function SolicitarCodigo() {
  const [correo, setCorreo] = useState("");
  const [codigo, setCodigo] = useState("");
  const [paso, setPaso] = useState("correo");
  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] = useState("error");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendTimer, setResendTimer] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    sessionStorage.removeItem("codigo_verificado");
    sessionStorage.removeItem("correo_verificado");
  }, []);

  useEffect(() => {
    if (resendTimer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  async function enviarCodigo(e) {
    e.preventDefault();
    setMensaje("");

    if (!correo.trim()) {
      setTipoMensaje("error");
      setMensaje("Ingresa tu correo");
      return;
    }

    if (paso === "correo") {
      setIsSubmitting(true);
      try {
        const resData = await requestNewCode(correo.trim());
        setTipoMensaje("success");
        setMensaje(resData?.message || "Te enviamos un codigo a tu correo");
        setPaso("codigo");
        setCodigo("");
        setResendTimer(60);
      } catch (err) {
        setTipoMensaje("error");
        setMensaje(err.response?.data?.message || "No se pudo enviar el codigo");
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!codigo.trim()) {
      setTipoMensaje("error");
      setMensaje("Ingresa tu codigo unico");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await verifyCode({ usuario: correo.trim(), codigo: codigo.trim() });
      if (res.status === 200 && res.data?.message === "Código válido") {
        setTipoMensaje("success");
        setMensaje("Codigo correcto. Redirigiendo...");
        sessionStorage.setItem("codigo_verificado", "true");
        sessionStorage.setItem("correo_verificado", correo.trim());
        setTimeout(() => {
          navigate("/verificar-codigo", { state: { correo: correo.trim() } });
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
    } finally {
      setIsSubmitting(false);
    }
  }

  async function reenviarCodigo() {
    if (!correo.trim()) {
      setTipoMensaje("error");
      setMensaje("Ingresa tu correo para reenviar el codigo");
      return;
    }

    if (paso !== "codigo" || resendTimer > 0 || isResending || isSubmitting) {
      return;
    }

    setIsResending(true);
    try {
      const resData = await requestNewCode(correo.trim());
      setTipoMensaje("success");
      setMensaje(resData?.message || "Te enviamos un nuevo codigo a tu correo");
      setResendTimer(60);
    } catch (err) {
      setTipoMensaje("error");
      setMensaje(err.response?.data?.message || "No se pudo reenviar el codigo");
      setResendTimer(60);
    } finally {
      setIsResending(false);
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
      {isSubmitting && (
        <div className="overlay-carga-prediccion" role="status" aria-live="polite">
          <div className="spinner-celeste-prediccion" aria-hidden="true"></div>
          <p>{paso === "correo" ? "Enviando código..." : "Verificando código..."}</p>
        </div>
      )}
      {paso === "correo" ? (
        <>
          <div className="input-codigo">
            <input
              type="text"
              placeholder="Ingrese su correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" className="boton-codigo" disabled={isSubmitting}>
            {isSubmitting ? "Enviando..." : "Enviar código"}
          </button>
        </>
      ) : (
        <>
          <div className="input-codigo">
            <input
              type="text"
              placeholder="Ingrese su codigo unico"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value)}
              disabled={isSubmitting}
            />
          </div>
          <button type="submit" className="boton-codigo" disabled={isSubmitting}>
            {isSubmitting ? "Verificando..." : "Verificar código"}
          </button>
        </>
      )}
    </form>
    {paso === "codigo" && (
      <div className="regresar-login" style={{ cursor: "default" }}>
       
        <button
        className="link-reenviar-codigo"
          type="button"
          //className="boton-codigo"
          onClick={reenviarCodigo}
          disabled={resendTimer > 0 || isResending || isSubmitting}
        >
          {isResending ? "Reenviando..." : resendTimer > 0 ? `Reenviar en ${formatCountdown(resendTimer)}` : "Reenviar codigo"}
        </button>
      </div>
    )}
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
