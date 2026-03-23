import Logo from '../Logo2.jpeg';
import '../css/login.css';
import { useState } from 'react';
import axios from 'axios';
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import AlertMessage from '../Componentes/AlertMessage';


function RegistroUsuario() {
  const navigate = useNavigate();
  const [correo,setCorreo]= useState('');
  const [contraseña,setContraseña]= useState('');
  const [nombre,setNombre]= useState('');
  const [apellido,setApellido]= useState(''); 
  const [confirmarContraseña,setConfirmarContraseña]= useState('');
  const [error, setError] = useState(''); 
  const [codigoUnico, setCodigoUnico] = useState('');
  const [mostrarDialogoCodigo, setMostrarDialogoCodigo] = useState(false);

  function handleCorreo(e){
   setCorreo(e.target.value);
  
  }

  function handleContraseña(e){
   setContraseña(e.target.value);
   
  }
  function handleNombre(e){
   setNombre(e.target.value);
  
  }
  function handleApellido(e){
   setApellido(e.target.value);

  }
  
  function handleConfirmarContraseña(e){
    setConfirmarContraseña(e.target.value);
  }

  async function onSubmit(event) {
  event.preventDefault();
   if (!correo || !contraseña || !confirmarContraseña || !nombre) {
    setError("Por favor, complete todos los campos");
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
              navigate('/');
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
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese el correo' value={correo} onChange={handleCorreo} /></div>
              

               <div className='input-contraseña'><AiFillLock />  <input type="password" placeholder='Ingrese su contraseña' value={contraseña} onChange={handleContraseña} /></div> 
               <div className='input-contraseña-confirmar'><AiFillLock />  <input type="password" placeholder='Confirme su contraseña' value={confirmarContraseña} onChange={handleConfirmarContraseña} /></div> 
               <div className='input-correo'><AiFillMail />  <input type="text" placeholder='Ingrese el nombre de la institucion' value={nombre} onChange={handleNombre} /></div>
  
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