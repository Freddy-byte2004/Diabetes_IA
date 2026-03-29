import Logo from '../Logo2.jpeg';
import '../css/login.css';
import { useState } from 'react';
import { changePassword } from '../services/authService';
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function OlvidoContrasena() {
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
     const res = await changePassword({ usuario: correo, nuevaContrasena: contraseña });

      console.log('respuesta del backend', res.data?.message || res.message || res);
      if (res.status === 200 && res.data?.message === 'Contraseña cambiada exitosamente') {
        alert('Cambio de contraseña exitoso');
        navigate('/');
      } else if (res.status >= 400 && res.status < 500) {
        alert(res.data?.message || 'Credenciales incorrectas');
      } else {
        alert('Error al cambiar la contraseña');
      }
    } catch (err) {
      console.log(err);
      alert('Error al conectar con el servidor');
    }
  }

return( 
  <div className='Contenedor-principal-login'>
    <div className='Contenedor-registro'>
        <div className='logo'>
            <img src={Logo} alt="Logo de la aplicación" />  
        </div>
        <div className='titulo'><h1>Olvido de contraseña</h1></div>
        <div className='formulario'>
            <form onSubmit={onSubmit}>
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese su correo' value={correo} onChange={handleCorreo} /></div>
              

               <div className='input-contraseña'><AiFillLock />  <input type="password" placeholder='Ingrese su nueva contraseña' value={contraseña} onChange={handleContraseña} /></div> 
               <div className='input-contraseña-confirmar'><AiFillLock />  <input type="password" placeholder='Confirme su contraseña' value={confirmarContraseña} onChange={handleConfirmarContraseña} /></div> 
              
                 <input type="submit" value="Cambiar contraseña" className='boton'/>
               
            </form>
            
        </div>
        <div className='pie'>
          <div className='contenedor-regresar-login '><Link to='https://diabetes-ia-1.onrender.com/'>¿Ya tienes una cuenta? Ingresa ahora mismo</Link></div>  
            
        </div>
    </div>
  </div>
);
}

export default OlvidoContrasena;