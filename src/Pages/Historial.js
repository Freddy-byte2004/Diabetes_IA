
import TablaHistorial from "../Componentes/TablaHistorial"
import {Navbar} from "../Componentes/Navbar"
import "../css/historial.css"
import { useEffect, useState } from "react";
import axios from "axios";

function Historial(){
const [datos, setDatos]= useState([]);

const correo= localStorage.getItem("correo_usuario");

const obtenerDatos=()=>{
axios.get(`https://diabetes-ia-backend-1.onrender.com/api/usuario/correo/${correo}`)
   
    
    .then((res)=>{
        
        axios.get(`https://diabetes-ia-backend-1.onrender.com/api/analisis/${res.data.id_usuario}`)

        .then((res)=>{
            
            const formattedData = res.data.map((usuarioData) => ({
                glucosa: usuarioData.glucosa,
                indice_de_masa_corporal: usuarioData.indice_de_masa_corporal,
                insulina: usuarioData.insulina,
                numero_de_embarazos: usuarioData.numero_de_embarazos,
                presion_arterial: usuarioData.presion_arterial,
                grosor_de_piel: usuarioData.grosor_de_piel,
                funcion_de_herencia: usuarioData.funcion_de_herencia,
                edad: usuarioData.edad,
                probabilidad_diabetes: usuarioData.probabilidad_diabetes,
                fecha_de_analisis: usuarioData.fecha_de_analisis
                }));
        setDatos(formattedData);
        console.log('Datos del usuario:', formattedData);
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
        <div className="contenedor-principal-historial">
            <div className="contenedor-navbar"> <><Navbar/></></div>
            <div className="pantalla-principal">
                
                <div className="contenedor-tabla"><TablaHistorial data={datos} /> </div>
            
            </div>
            
            
        </div>
        </div>
    )


}

export default Historial;