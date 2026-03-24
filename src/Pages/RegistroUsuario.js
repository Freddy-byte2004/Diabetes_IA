import Logo from '../Logo2.jpeg';
import '../css/login.css';
import { useState } from 'react';
import axios from 'axios';
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
  const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

   if (!correo || !contraseña || !confirmarContraseña || !nombre) {
    setError("Por favor, complete todos los campos");
    return;
  }

  if (!gmailRegex.test(correo)) {
    setError('Ingresa un correo valido con formato @gmail.com');
    return;
  }

  if (contraseña.length <= 6) {
    setError('La contrasena debe tener mas de 6 caracteres');
    return;
  }

  if(contraseña !== confirmarContraseña){
    setError("Las contraseñas no coinciden");
    return;
  }

    try{
     const  res= await axios.post('https://diabetes-ia-backend-1.onrender.com/api/auth/register', {
  usuario: correo,
  contrasena: contraseña,
  nombre: nombre,
});

      console.log("respuesta del backend", res.data.message);
      if(res.data.message === "Usuario registrado exitosamente"){
       setError('');
       setCodigoUnico(res.data.codigo_unico || 'No disponible');
       setMostrarDialogoCodigo(true);
      } else {
        console.log("Error en el registro:", res.data.message);
        setError(res.data.message?.trim() || 'Error en el registro');
      }
    }catch(err){
      console.log(err);
      setError("Error al conectar con el servidor");
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
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese el correo' value={correo} onChange={handleCorreo} pattern={"^[a-zA-Z0-9._%+-]+@gmail\\.com$"} required onInvalid={setCorreoValidationMessage} onInput={(e) => e.target.setCustomValidity('')} /></div>
              

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
                   />
                   <button
                     type='button'
                     className='toggle-password-btn'
                     onClick={() => setShowPassword(s => !s)}
                     aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                     title={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
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
                   />
                   <button
                     type='button'
                     className='toggle-password-btn'
                     onClick={() => setShowConfirmPassword(s => !s)}
                     aria-label={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                     title={showConfirmPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                   >
                     {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
                   </button>
                 </div>
               </div>
               <div className='input-correo'><AiFillMail />  <input type="text" placeholder='Ingrese el nombre de la institucion' value={nombre} onChange={handleNombre} required onInvalid={setNombreValidationMessage} onInput={(e) => e.target.setCustomValidity('')} /></div>
  
                 <input type="submit" value="Registrar" className='boton'/>
               
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