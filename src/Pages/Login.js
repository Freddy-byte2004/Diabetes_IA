import Logo from '../Logo2.jpeg';
import '../css/login.css';
import { useState } from 'react';
import { login, verifyAccount, resendVerificationCode } from '../services/authService';
import { AiFillMail, AiFillLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  
import AlertMessage from '../Componentes/AlertMessage';
import VerificationModal from '../Componentes/VerificationModal';

function Login() {
  const navigate = useNavigate();
  const [correo,setCorreo]= useState('');
  const [contraseña,setContraseña]= useState('');
  const [error, setError]= useState('');  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);

  function setCorreoValidationMessage(event) {
    const { validity } = event.target;

    if (validity.valueMissing) {
      event.target.setCustomValidity('Completa este campo');
      return;
    }

    if (validity.typeMismatch || validity.patternMismatch) {
      event.target.setCustomValidity('Ingresa un correo valido con formato @gmail.com');
      return;
    }

    event.target.setCustomValidity('');
  }

  function setContrasenaValidationMessage(event) {
    const { validity } = event.target;

    if (validity.valueMissing) {
      event.target.setCustomValidity('Ingresa la contrasena');
      return;
    }

    event.target.setCustomValidity('');
  }
 

  function handleCorreo(e){
   setCorreo(e.target.value);
  
  }

  function handleContraseña(e){
   setContraseña(e.target.value);
   
  }

  async function handleFinalLogin() {
    const resData = await login({ usuario: correo, contrasena: contraseña });
    if (resData.message === 'Inicio de sesión exitoso') {
      localStorage.setItem('correo_usuario', correo);
      localStorage.setItem('token', resData.token);
      localStorage.setItem('id_institucion', resData.id);
      navigate('/dashboard');
      return { ok: true };
    }

    return {
      ok: false,
      message: resData?.message?.trim() || 'No se pudo iniciar sesion.'
    };
  }

  async function handleVerifyAccount(codigo) {
    setIsVerifyingCode(true);
    try {
      const verificationData = await verifyAccount({ usuario: correo, codigo });
      const verificationMessage = verificationData?.message?.trim();

      if (verificationMessage === 'Cuenta verificada exitosamente') {
        const loginData = await handleFinalLogin();
        if (loginData.ok) {
          return {
            ok: true,
            message: 'Cuenta verificada exitosamente. Iniciando sesion...'
          };
        }

        return {
          ok: false,
          message: loginData.message || 'Cuenta verificada, pero no se pudo iniciar sesion.'
        };
      }

      return {
        ok: false,
        message: verificationMessage || 'No se pudo verificar la cuenta.'
      };
    } catch (err) {
      const backendMessage = err.response?.data?.message?.trim();
      return {
        ok: false,
        message: backendMessage || 'Error al verificar la cuenta.'
      };
    } finally {
      setIsVerifyingCode(false);
    }
  }

  async function handleResendCode() {
    setIsResendingCode(true);
    try {
      const resData = await resendVerificationCode({ usuario: correo });
      return {
        ok: true,
        message: resData?.message?.trim() || 'Te enviamos un nuevo codigo a tu correo.'
      };
    } catch (err) {
      const backendMessage = err.response?.data?.message?.trim();
      return {
        ok: false,
        message: backendMessage || 'No se pudo reenviar el codigo.'
      };
    } finally {
      setIsResendingCode(false);
    }
  }


  async function onSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const resData = await login({ usuario: correo, contrasena: contraseña });
  
      if (resData.message === 'Inicio de sesión exitoso') {
        localStorage.setItem('correo_usuario', correo);
        localStorage.setItem('token', resData.token);
        localStorage.setItem('id_institucion', resData.id);
        navigate('/dashboard');
      } else {
        console.log('Error de autenticación:', resData.message);
        setError(resData.message?.trim() || 'Credenciales incorrectas');
      }
    } catch (err) {
      const statusCode = err.response?.status;
      const backendMessage = err.response?.data?.message?.trim();

      if (statusCode === 429) {
        setError('Demasiadas solicitudes. Por favor, espera 15 minutos antes de intentar nuevamente.');
      } else
      if (backendMessage === 'Debes verificar tu cuenta antes de iniciar sesión') {
        setError('');
        setShowVerificationModal(true);
      } else if (backendMessage?.toLowerCase().includes('demasiadas solicitudes')) {
        setError('Demasiadas solicitudes. Por favor, espera 15 minutos antes de intentar nuevamente.');
      } else if (backendMessage) {
        setError(backendMessage || "Error al conectar con el servidor");
        console.log("Error del servidor:", backendMessage);
      }else{
        setError("Error al conectar con el servidor");
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return( 
    <div className='Contenedor-principal-login'>
      <AlertMessage message={error} type="error" onClose={() => setError('')} />
      <VerificationModal
        isOpen={showVerificationModal}
        usuario={correo}
        title='Verifica tu cuenta para continuar'
        subtitle='Tu cuenta aun no esta verificada. Ingresa el codigo que enviamos a tu correo para iniciar sesion.'
        onVerify={handleVerifyAccount}
        onResend={handleResendCode}
        onClose={() => setShowVerificationModal(false)}
        verifyLabel='Verificar e iniciar sesion'
        resendCooldownSeconds={60}
        expirationMinutes={15}
        loadingVerify={isVerifyingCode}
        loadingResend={isResendingCode}
      />
      <div className='Contenedor-login'>
          <div className='logo'>
              <img src={Logo} alt="Logo de la aplicación" />  
          </div>
          <div className='titulo'><h1>AI Prediccion de diabetes</h1></div>
          <div className='formulario'>
              {isSubmitting && (
                <div className="overlay-carga-prediccion" role="status" aria-live="polite">
                  <div className="spinner-celeste-prediccion" aria-hidden="true"></div>
                  <p>Iniciando sesión...</p>
                </div>
              )}
              <form onSubmit={onSubmit}>
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese su correo' value={correo} onChange={handleCorreo} pattern="^[a-zA-Z0-9._%+-]+@gmail\.com$" required onInvalid={setCorreoValidationMessage} onInput={(e) => e.target.setCustomValidity('')} disabled={isSubmitting} /></div>
                <div className='input-contraseña'>
                  <AiFillLock />
                  <div className='password-input-wrap'>
                    <input type={showPassword ? 'text' : 'password'} placeholder='Ingrese su contraseña' value={contraseña} onChange={handleContraseña} required onInvalid={setContrasenaValidationMessage} onInput={(e) => e.target.setCustomValidity('')} disabled={isSubmitting} />
                    <button
                      type="button"
                      className='toggle-password-btn'
                      onClick={() => setShowPassword((prev) => !prev)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                </div> 
                <input type="submit" value={isSubmitting ? "Iniciando..." : "Iniciar sesión"} className='boton' disabled={isSubmitting} />
              </form>
          </div>
          <div className='pie'>
            <div className='Olvido-contrasena'><Link to='/solicitar-codigo'>¿Has olvidado la contraseña?</Link></div>  
              <div className='registro'><Link to='/registro'>Regístrate</Link></div>
          </div>
      </div>
    </div>
  );
}

export default Login;