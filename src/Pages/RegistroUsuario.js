import Logo from '../Logo2.jpeg';
import '../css/login.css';
import { useState } from 'react';
import { register, verifyAccount, resendVerificationCode } from '../services/authService';
import { AiFillMail, AiFillLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AlertMessage from '../Componentes/AlertMessage';
import VerificationModal from '../Componentes/VerificationModal';


function RegistroUsuario() {
  const navigate = useNavigate();
  const [correo,setCorreo]= useState('');
  const [contraseña,setContraseña]= useState('');
  const [nombre,setNombre]= useState('');
  const [confirmarContraseña,setConfirmarContraseña]= useState('');
  const [error, setError] = useState(''); 
  const [mostrarModalVerificacion, setMostrarModalVerificacion] = useState(false);
  const [isVerifyingCode, setIsVerifyingCode] = useState(false);
  const [isResendingCode, setIsResendingCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      event.target.setCustomValidity('Completa este campo');
      return;
    }

    if (validity.tooShort) {
      event.target.setCustomValidity('La contrasena debe tener mas de 6 caracteres');
      return;
    }

    event.target.setCustomValidity('');
  }

  function setConfirmarContrasenaValidationMessage(event) {
    const { value, validity } = event.target;

    if (validity.valueMissing) {
      event.target.setCustomValidity('Completa este campo');
      return;
    }

    if (value !== contraseña) {
      event.target.setCustomValidity('Las contrasenas no coinciden');
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
  function handleNombre(e){
   setNombre(e.target.value);
  
  }
  
  function handleConfirmarContraseña(e){
    setConfirmarContraseña(e.target.value);
  }

  async function handleVerifyAccount(codigo) {
    setIsVerifyingCode(true);
    try {
      const resData = await verifyAccount({ usuario: correo, codigo });
      const message = resData?.message?.trim();

      if (message === 'Cuenta verificada exitosamente') {
        setTimeout(() => {
          setMostrarModalVerificacion(false);
          navigate('/login');
        }, 1800);

        return {
          ok: true,
          message: 'Cuenta verificada exitosamente. Redirigiendo al inicio de sesion...'
        };
      }

      return {
        ok: false,
        message: message || 'No se pudo verificar la cuenta.'
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
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!correo || !contraseña || !confirmarContraseña) {
      setError("Por favor, complete todos los campos");
      setIsSubmitting(false);
      return;
    }

    if (!gmailRegex.test(correo)) {
      setError('Ingresa un correo valido con formato @gmail.com');
      setIsSubmitting(false);
      return;
    }


    // Validación: más de 6 caracteres, al menos un número y un carácter especial
    const regexNumero = /[0-9]/;
    const regexEspecial = /[!@#$%^&*(),.?":{}|<>_-]/;
    const regexMayuscula = /[A-Z]/;
    if (contraseña.length <= 6) {
      setError('La contraseña debe tener más de 6 caracteres');
      setIsSubmitting(false);
      return;
    }
    if (!regexNumero.test(contraseña)) {
      setError('La contraseña debe contener al menos un número');
      setIsSubmitting(false);
      return;
    }
    if (!regexEspecial.test(contraseña)) {
      setError('La contraseña debe contener al menos un carácter especial');
      setIsSubmitting(false);
      return;
    }
    if (!regexMayuscula.test(contraseña)) {
      setError('La contraseña debe contener al menos una letra mayúscula');
      setIsSubmitting(false);
      return;
    }

    if(contraseña !== confirmarContraseña){
      setError("Las contraseñas no coinciden");
      setIsSubmitting(false);
      return;
    }

    try{
      const resData = await register({ usuario: correo, contrasena: contraseña, nombre });
      const backendMessage = resData?.message?.trim() || '';
      console.log('respuesta del backend', backendMessage);

      const registroExitoso =
        /registrad|registro|cuenta creada/i.test(backendMessage) ||
        resData?.success === true;

      if (registroExitoso) {
        setError('');
        setMostrarModalVerificacion(true);
      } else {
        console.log('Error en el registro:', backendMessage);
        setError(backendMessage || 'Error en el registro');
      }
    }catch(err){
      console.log(err);
      // Si el backend responde con el mensaje específico, lo mostramos
      if (err.response && err.response.data && err.response.data.message === 'Ya existe un usuario con ese correo') {
        setError('Ya existe un usuario con ese correo');
      } else if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message.trim() || "Error al conectar con el servidor");
      } else {
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
      isOpen={mostrarModalVerificacion}
      usuario={correo}
      title='Verifica tu cuenta'
      subtitle='Ingresa el codigo de verificacion que enviamos a tu correo para activar tu cuenta.'
      onVerify={handleVerifyAccount}
      onResend={handleResendCode}
      onClose={() => setMostrarModalVerificacion(false)}
      verifyLabel='Verificar cuenta'
      resendCooldownSeconds={60}
      expirationMinutes={15}
      loadingVerify={isVerifyingCode}
      loadingResend={isResendingCode}
    />

    <div className='Contenedor-registro'>
        <div className='logo'>
            <img src={Logo} alt="Logo de la aplicación" />  
        </div>
        <div className='titulo'><h1>Registro de usuario</h1></div>
        <div className='formulario'>
            <form onSubmit={onSubmit}>
                {isSubmitting && (
                  <div className="overlay-carga-prediccion" role="status" aria-live="polite">
                    <div className="spinner-celeste-prediccion" aria-hidden="true"></div>
                    <p>Registrando usuario...</p>
                  </div>
                )}
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese el correo' value={correo} onChange={handleCorreo} pattern={"^[a-zA-Z0-9._%+-]+@gmail\\.com$"} required onInvalid={setCorreoValidationMessage} onInput={(e) => e.target.setCustomValidity('')} disabled={isSubmitting} /></div>
                <div className='input-contraseña'><AiFillLock />
                  <div className='password-input-wrap'>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      placeholder='Ingrese su contraseña'
                      value={contraseña}
                      onChange={handleContraseña}
                      minLength={7}
                      required
                      onInvalid={setContrasenaValidationMessage}
                      onInput={(e) => e.target.setCustomValidity('')}
                      disabled={isSubmitting}
                    />
                    <button
                      type='button'
                      className='toggle-password-btn'
                      onClick={() => setShowPassword(s => !s)}
                      aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      disabled={isSubmitting}
                    >
                      {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                </div>
                <div className='input-contraseña-confirmar'><AiFillLock />
                  <div className='password-input-wrap'>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      placeholder='Confirme su contraseña'
                      value={confirmarContraseña}
                      onChange={handleConfirmarContraseña}
                      required
                      onInvalid={setConfirmarContrasenaValidationMessage}
                      onInput={setConfirmarContrasenaValidationMessage}
                      disabled={isSubmitting}
                    />
                    <button
                      type='button'
                      className='toggle-password-btn'
                      onClick={() => setShowConfirmPassword(s => !s)}
                      aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                      disabled={isSubmitting}
                    >
                      {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                    </button>
                  </div>
                </div>
                <div className='input-correo'><AiFillMail />  <input type="text" placeholder='Ingrese el nombre de la institucion (opcional)' value={nombre} onChange={handleNombre}  disabled={isSubmitting} /></div>
                <input type="submit" value={isSubmitting ? "Registrando..." : "Registrar"} className='boton' disabled={isSubmitting} />
            </form>
            
        </div>
        <div className='pie'>
          <div className='Olvido-contrasena'><Link to='/login'>¿Ya tienes una cuenta? Ingresa ahora mismo</Link></div>  
            
        </div>
    </div>
  </div>
);
}

export default RegistroUsuario;