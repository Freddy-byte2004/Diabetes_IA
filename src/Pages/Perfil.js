
import Tabla from "../Componentes/puta"
import {Navbar} from "../Componentes/Navbar"
import "../css/perfil.css"
import { useEffect, useState } from "react";
import axios from "axios";


const data=[{
    nombre: "Juan",
    apellido: "Pérez",
    direccion: "Calle Falsa 123",
    telefono: "555-1234"
},]
function Perfil(){
const [idUsuario, setIdUsuario] = useState(null);

const correo= localStorage.getItem("correo_usuario");

  useEffect(() => {
    axios.get(`https://diabetes-ia-backend-1.onrender.com/api/usuario/correo/${correo}`)
      .then((res) => {
        setIdUsuario(res.data.id_usuario);
        console.log('ID del usuario:', res.data.id_usuario);
      })
      .catch((err) => {
        console.error('Error al obtener el ID:', err);
      });
  }, []); 
    return(
        <div className="contenedor-principal">
        <div className="contenedor-principal-perfil">
            <div className="contenedor-navbar"> <><Navbar/></></div>
            <div className="pantalla-principal">
                <div className="contenedor-titulo"><h1>Datos del usuario</h1></div>
                <div className="contenedor-tabla"><Tabla data={data}/> </div>
            
            </div>
            
            
        </div>
        </div>
    )


}

export default Perfil;