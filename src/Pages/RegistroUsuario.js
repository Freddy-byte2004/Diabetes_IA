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
   if (!correo || !contraseña || !confirmarContraseña || !nombre || !apellido) {
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
  apellido: apellido
});

      console.log("respuesta del backend", res.data.message);
      if(res.data.message === "Usuario registrado exitosamente"){
       setError("Usuario registrado exitosamente");
         setTimeout(() => {
        navigate('/');
      }, 3000);
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
    <AlertMessage message={error} type={error === "Usuario registrado exitosamente" ? "success" : "error"} onClose={() => setError('')} />
    <div className='Contenedor-registro'>
        <div className='logo'>
            <img src={Logo} alt="Logo de la aplicación" />  
        </div>
        <div className='titulo'><h1>Registro de usuario</h1></div>
        <div className='formulario'>
            <form onSubmit={onSubmit}>
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese su correo' value={correo} onChange={handleCorreo} /></div>
              

               <div className='input-contraseña'><AiFillLock />  <input type="password" placeholder='Ingrese su contraseña' value={contraseña} onChange={handleContraseña} /></div> 
               <div className='input-contraseña-confirmar'><AiFillLock />  <input type="password" placeholder='Confirme su contraseña' value={confirmarContraseña} onChange={handleConfirmarContraseña} /></div> 
               <div className='input-correo'><AiFillMail />  <input type="text" placeholder='Ingrese su nombre' value={nombre} onChange={handleNombre} /></div>
               <div className='input-correo'><AiFillMail />  <input type="text" placeholder='Ingrese su apellido' value={apellido} onChange={handleApellido} /></div>
                 <input type="submit" value="Registrar" className='boton'/>
               
            </form>
            
        </div>
        <div className='pie'>
          <div className='Olvido-contrasena'><Link to='/'>¿Ya tienes una cuenta? Ingresa ahora mismo</Link></div>  
            
        </div>
    </div>
  </div>
);
}

export default RegistroUsuario;