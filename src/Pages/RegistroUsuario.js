import Logo from '../Logo2.jpeg';
import '../css/login.css';
import { useState } from 'react';
import { register } from '../services/authService';
import { AiFillMail, AiFillLock, AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AlertMessage from '../Componentes/AlertMessage';


function RegistroUsuario() {
  const navigate = useNavigate();
  const [correo,setCorreo]= useState('');
  const [contraseña,setContraseña]= useState('');
  const [nombre,setNombre]= useState('');
  const [confirmarContraseña,setConfirmarContraseña]= useState('');
  const [error, setError] = useState(''); 
  const [codigoUnico, setCodigoUnico] = useState('');
  const [mostrarDialogoCodigo, setMostrarDialogoCodigo] = useState(false);
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

  function setNombreValidationMessage(event) {
    if (event.target.validity.valueMissing) {
      event.target.setCustomValidity('Completa este campo');
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

  async function onSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!correo || !contraseña || !confirmarContraseña || !nombre) {
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
    const regexEspecial = /[!@#$%^&*(),.?":{}|<>_\-]/;
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
      console.log('respuesta del backend', resData.message);
      if (resData.message === 'Usuario registrado exitosamente') {
        setError('');
        setCodigoUnico(resData.codigo_unico || 'No disponible');
        setMostrarDialogoCodigo(true);
      } else {
        console.log('Error en el registro:', resData.message);
        setError(resData.message?.trim() || 'Error en el registro');
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

    {mostrarDialogoCodigo && (
      <div className='dialogo-overlay-codigo'>
        <div className='dialogo-codigo'>
          <h2>Registro exitoso</h2>
          <p>
            Este es tu codigo unico:
          </p>
          <div className='codigo-unico-valor'>{codigoUnico}</div>
          <p>
            Guardalo en un lugar seguro. No volveras a verlo y lo necesitaras para cambiar o recuperar tu contraseña.
          </p>
          <button
            type='button'
            className='boton-codigo-dialogo'
            onClick={() => {
              setMostrarDialogoCodigo(false);
              navigate('/login');
            }}
          >
            Entendido
          </button>
        </div>
      </div>
    )}

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
                <div className='input-correo'><AiFillMail />  <input type="text" placeholder='Ingrese el nombre de la institucion' value={nombre} onChange={handleNombre} required onInvalid={setNombreValidationMessage} onInput={(e) => e.target.setCustomValidity('')} disabled={isSubmitting} /></div>
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