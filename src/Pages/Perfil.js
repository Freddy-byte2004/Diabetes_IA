
import Tabla from "../Componentes/puta"
import {Navbar} from "../Componentes/Navbar"
import "../css/perfil.css"
import { useEffect, useState } from "react";
import axios from "axios";


const data=[{
    
},]
function Perfil(){
const [datos, setDatos]= useState([]);

const correo= localStorage.getItem("correo_usuario");

const obtenerDatos=()=>{
axios.get(`https://diabetes-ia-backend-1.onrender.com/api/usuario/correo/${correo}`)
    
    
    .then((res)=>{
        
        axios.get(`https://diabetes-ia-backend-1.onrender.com/api/usuario/${res.data.id_usuario}`)

        .then((res)=>{
            const usuarioData= res.data[0];
        const formattedData= [{
            id_usuario: usuarioData.id_usuario,
            nombre: usuarioData.nombre,
            apellido: usuarioData.apellido,
            cedula: usuarioData.cedula, 
            direccion: usuarioData.direccion,
            telefono: usuarioData.telefono
        }];
        setDatos(formattedData);
        console.log('Datos del usuario:', formattedData[0]);
        }).catch((err)=>{
            console.error('Error al obtener los datos del usuario:', err);
        });
        
    })
    .catch((err)=>{
        console.error('Error al obtener los datos del usuario:', err);
    })
}

useEffect(()=>{

    
    obtenerDatos();


},[])
    return(
        <div className="contenedor-principal">
        <div className="contenedor-principal-perfil">
            <div className="contenedor-navbar"> <><Navbar/></></div>
            <div className="pantalla-principal">
                <div className="contenedor-titulo"><h1>Datos del usuario</h1></div>
                <div className="contenedor-tabla"><Tabla data={datos} onDatosActualizados={obtenerDatos}/> </div>
            
            </div>
            
            
        </div>
        </div>
    )


}

export default Perfil;