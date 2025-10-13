import Logo from '../Logo.jpeg';
import '../css/login.css';
import { useState } from 'react';
import axios from 'axios';
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';


function RegistroUsuario() {
  const navigate = useNavigate();
  const [correo,setCorreo]= useState('');
  const [contraseña,setContraseña]= useState('');
  const [confirmarContraseña,setConfirmarContraseña]= useState('');
 

  function handleCorreo(e){
   setCorreo(e.target.value);
  
  }

  function handleContraseña(e){
   setContraseña(e.target.value);
   
  }
  
  function handleConfirmarContraseña(e){
    setConfirmarContraseña(e.target.value);
  }

  async function onSubmit(event) {
  event.preventDefault();

  if(contraseña !== confirmarContraseña){
    alert("Las contraseñas no coinciden");
    return;
  }

    try{
     const  res= await axios.post('https://diabetes-ia-backend-1.onrender.com/api/auth/register', {
  usuario: correo,
  contrasena: contraseña
});

      console.log("respuesta del backend", res.data.message);
      if(res.data.message === "Usuario registrado exitosamente"){
        alert("Usuario registrado exitosamente");
        navigate('/');
      } else {
        alert("Credenciales incorrectas")
      }
    }catch(err){
      console.log(err);
    }
  }

return( 
  <div className='Contenedor-principal-login'>
    <div className='Contenedor-login'>
        <div className='logo'>
            <img src={Logo} alt="Logo de la aplicación" />  
        </div>
        <div className='titulo'><h1>Registro de usuario</h1></div>
        <div className='formulario'>
            <form onSubmit={onSubmit}>
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese su correo' value={correo} onChange={handleCorreo} /></div>
              

               <div className='input-contraseña'><AiFillLock />  <input type="password" placeholder='Ingrese su contraseña' value={contraseña} onChange={handleContraseña} /></div> 
               <div className='input-contraseña-confirmar'><AiFillLock />  <input type="password" placeholder='Confirme su contraseña' value={confirmarContraseña} onChange={handleConfirmarContraseña} /></div> 
                 <input type="submit" value="Registrar" className='boton'/>
               
            </form>
            
        </div>
        <div className='pie'>
          <div className='Olvido-contrasena'><a href='http://localhost:3000/'>¿Ya tienes una cuenta? Ingresa ahora mismo</a></div>  
            
        </div>
    </div>
  </div>
);
}

export default RegistroUsuario;