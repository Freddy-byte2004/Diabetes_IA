import Logo from '../Logo.jpeg';
import '../css/login.css';
import { useState } from 'react';
import axios from 'axios';
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';


function Login() {
  const navigate = useNavigate();
  const [correo,setCorreo]= useState('');
  const [contraseña,setContraseña]= useState('');
 

  function handleCorreo(e){
   setCorreo(e.target.value);
  
  }

  function handleContraseña(e){
   setContraseña(e.target.value);
   
  }

  async function onSubmit(event) {
  event.preventDefault();

    try{
     const  res= await axios.post('http://localhost:3001/api/auth/login', {
  usuario: correo,
  contrasena: contraseña
});

      console.log("respuesta del backend", res.data.message);
      if(res.data.message === "Inicio de sesión exitoso"){
        localStorage.setItem('correo_usuario', correo);
        navigate("/dashboard");
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
        <div className='titulo'><h1>AI Prediccion de diabetes</h1></div>
        <div className='formulario'>
            <form onSubmit={onSubmit}>
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese su correo' value={correo} onChange={handleCorreo} /></div>
              

               <div className='input-contraseña'><AiFillLock />  <input type="password" placeholder='Ingrese su contraseña' value={contraseña} onChange={handleContraseña} /></div> 
                <div className='boton'> <input type="submit" value="Iniciar sesión" /></div>
               
            </form>
            
        </div>
        <div className='pie'>
          <div className='Olvido-contrasena'><a href='#'>¿Has olvidado la contraseña?</a></div>  
            <div className='registro'><a href='#'>Regístrate</a></div>
        </div>
    </div>
  </div>
);
}

export default Login;