
import TablaHistorial from "../Componentes/TablaHistorial"
import {Navbar} from "../Componentes/Navbar"
import "../css/historial.css"
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

function Historial(){
const [datos, setDatos]= useState([]);
const [nombreUsuario, setNombreUsuario] = useState('');
const [loading, setLoading] = useState(true);

const correo= localStorage.getItem("correo_usuario");

const obtenerDatos=useCallback(async ()=>{
  setLoading(true);
  try {
    if (!correo) {
      setDatos([]);
      setNombreUsuario('Usuario');
      return;
    }

    const usuarioPorCorreo = await axios.get(`https://diabetes-ia-backend-1.onrender.com/api/usuario/correo/${correo}`);
    const id = usuarioPorCorreo.data.id_usuario;

    const [resUser, resAnalisis] = await Promise.all([
      axios.get(`https://diabetes-ia-backend-1.onrender.com/api/usuario/${id}`),
      axios.get(`https://diabetes-ia-backend-1.onrender.com/api/analisis/${id}`)
    ]);

    const usuario = resUser.data[0] || {};
    const nombreCompleto = `${usuario.nombre || ''} ${usuario.apellido || ''}`.trim();
    setNombreUsuario(nombreCompleto || 'Usuario');

    const formattedData = resAnalisis.data.map((usuarioData) => ({
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
  } catch (err) {
    console.error('Error al obtener los datos del usuario:', err);
    setDatos([]);
  } finally {
    setLoading(false);
  }
}, [correo])

useEffect(()=>{
  obtenerDatos();
},[obtenerDatos])
    return(
         <div className="historial-page">
    <div className="historial-panel">
      <div className="historial-navbar">
        <Navbar />
      </div>
      <div className="historial-main">
        <div className="historial-title-wrap">
          <h1>Historial de consultas del paciente: {nombreUsuario || '—'}</h1>
        </div>
        <div className="historial-table-wrap">
          {loading ? (
            <div className="historial-loader" role="status" aria-live="polite">
              <div className="spinner-celeste" aria-hidden="true"></div>
              <p>Cargando datos...</p>
            </div>
          ) : datos.length > 0 ? (
            <TablaHistorial data={datos} />
          ) : (
            <p className="mensaje-vacio">No hay consultas realizadas por parte del usuario</p>
          )}
        </div>
      </div>
    </div>
  </div>
    )


}

export default Historial;