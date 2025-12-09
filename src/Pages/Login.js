import Logo from '../Logo.jpeg';
import '../css/login.css';
import { useState } from 'react';
import axios from 'axios';
import { AiFillMail, AiFillLock } from "react-icons/ai";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';  
import AlertMessage from '../Componentes/AlertMessage';

function Login() {
  const navigate = useNavigate();
  const [correo,setCorreo]= useState('');
  const [contraseña,setContraseña]= useState('');
  const [error, setError]= useState('');  
 

  function handleCorreo(e){
   setCorreo(e.target.value);
  
  }

  function handleContraseña(e){
   setContraseña(e.target.value);
   
  }

  async function onSubmit(event) {
  event.preventDefault();

    try{
     const  res= await axios.post('https://diabetes-ia-backend-1.onrender.com/api/auth/login', {
  usuario: correo,
  contrasena: contraseña
});
 
      console.log("respuesta del backend", res.data.token);
    
      if(res.data.message === "Inicio de sesión exitoso"){
        localStorage.setItem('correo_usuario', correo);
        localStorage.setItem('token', res.data.token);
        navigate("/dashboard");
      } else {
        console.log("Error de autenticación:", res.data.message);
        setError(res.data.message?.trim() || 'Credenciales incorrectas');
      }
    }catch(err){
       if (err.response && err.response.data && err.response.data.message) {
        setError(err.response?.data?.message?.trim() || "Error al conectar con el servidor");
        console.log("Error del servidor:", err.response.data.message);
      } else {
        setError("Error al conectar con el servidor");
      }
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
            <form onSubmit={onSubmit}>
                <div className='input-correo'><AiFillMail />  <input type="email" placeholder='Ingrese su correo' value={correo} onChange={handleCorreo} /></div>
              

               <div className='input-contraseña'><AiFillLock />  <input type="password" placeholder='Ingrese su contraseña' value={contraseña} onChange={handleContraseña} /></div> 
                <input type="submit" value="Iniciar sesión" className='boton' />
               
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