import Logo from '../Logo2.jpeg';
import '../css/login.css';
import { useState } from 'react';
import { login } from '../services/authService';
import { AiFillMail, AiFillLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  
import AlertMessage from '../Componentes/AlertMessage';

function Login() {
  const navigate = useNavigate();
  const [correo,setCorreo]= useState('');
  const [contraseña,setContraseña]= useState('');
  const [error, setError]= useState('');  
  const [showPassword, setShowPassword] = useState(false);
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


  async function onSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    try {
      const resData = await login({ usuario: correo, contrasena: contraseña });
      console.log('respuesta del backend', resData.token);
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
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response?.data?.message?.trim() || "Error al conectar con el servidor");
        console.log("Error del servidor:", err.response.data.message);
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