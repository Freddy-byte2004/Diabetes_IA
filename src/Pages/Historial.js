
import TablaHistorial from "../Componentes/TablaHistorial"
import {Navbar} from "../Componentes/Navbar"
import "../css/historial.css"
import { useCallback, useEffect, useState } from "react";
import { getAll as getAllPacientes } from "../services/pacienteService";
import { fetchFullHistorial, generateHistorialXlsBlob, getHistorialByPaciente } from "../services/historialService";

function Historial(){
const [datos, setDatos]= useState([]);
const [nombreUsuario, setNombreUsuario] = useState('');
const [loading, setLoading] = useState(true);
const [pacientes, setPacientes] = useState([]);
const [idPacienteSeleccionado, setIdPacienteSeleccionado] = useState(
  localStorage.getItem('id_paciente_historial') || ''
);
const [usuarioInfo, setUsuarioInfo] = useState({
  nombre: 'Usuario',
  apellido: 'No disponible',
  telefono: 'No disponible',
  cedula: 'No disponible',
  direccion: 'No disponible'
});



const handlePacienteChange = (event) => {
  const nuevoIdPaciente = event.target.value;
  setIdPacienteSeleccionado(nuevoIdPaciente);
  localStorage.setItem('id_paciente_historial', nuevoIdPaciente);

  const pacienteSeleccionado = pacientes.find(
    (paciente) => String(paciente.id_paciente) === String(nuevoIdPaciente)
  );

  if (pacienteSeleccionado) {
    setNombreUsuario(`${pacienteSeleccionado.nombre || ''} ${pacienteSeleccionado.apellido || ''}`.trim() || 'Usuario');
  }
};

const exportarHistorialXls = () => {
  if (!datos.length) return;

  const blob = generateHistorialXlsBlob(datos, usuarioInfo, nombreUsuario || "usuario");
  const fechaReporte = new Date().toISOString().split("T")[0];
  const url = URL.createObjectURL(blob);
  const nombre = (nombreUsuario || "usuario").replace(/\s+/g, "_").toLowerCase();

  const link = document.createElement("a");
  link.href = url;
  link.download = `historial_${nombre}_${fechaReporte}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

const obtenerDatos=useCallback(async ()=>{
  setLoading(true);
    try {
      if (!idPacienteSeleccionado) {
        setDatos([]);
        setNombreUsuario('Usuario');
        setUsuarioInfo({
          nombre: 'Usuario',
          apellido: 'No disponible',
          telefono: 'No disponible',
          cedula: 'No disponible',
          direccion: 'No disponible'
        });
        return;
      }

      const { paciente, analisis } = await fetchFullHistorial(idPacienteSeleccionado);

      const pacienteObj = paciente || {};
      const nombreCompleto = `${pacienteObj.nombre || ''} ${pacienteObj.apellido || ''}`.trim();
      setNombreUsuario(nombreCompleto || 'Usuario');
      setUsuarioInfo({
        nombre: pacienteObj.nombre || 'Usuario',
        apellido: pacienteObj.apellido || 'No disponible',
        telefono: pacienteObj.telefono || 'No disponible',
        cedula: pacienteObj.cedula || 'No disponible',
        direccion: pacienteObj.direccion || 'No disponible'
      });

      const analisisData = Array.isArray(analisis) ? analisis : [];
      const formattedData = analisisData.map((usuarioData) => ({
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
}, [idPacienteSeleccionado])

useEffect(()=>{
  obtenerDatos();
},[obtenerDatos])

useEffect(() => {
  const cargarPacientes = async () => {
    try {
      const idInstitucion = localStorage.getItem('id_institucion');
      const pacientesData = await getAllPacientes(idInstitucion);
      setPacientes(pacientesData);

      if (!pacientesData.length) {
        return;
      }

      const idGuardado = localStorage.getItem('id_paciente_historial') || '';
      const existeIdGuardado = pacientesData.some(
        (paciente) => String(paciente.id_paciente) === String(idGuardado)
      );

      if (existeIdGuardado) {
        setIdPacienteSeleccionado(String(idGuardado));
      } else if (!idPacienteSeleccionado) {
        const primerIdPaciente = String(pacientesData[0].id_paciente);
        setIdPacienteSeleccionado(primerIdPaciente);
        localStorage.setItem('id_paciente_historial', primerIdPaciente);
      }
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      setPacientes([]);
    }
  };

  cargarPacientes();
}, [idPacienteSeleccionado]);

    return(
         <div className="historial-page">
    <div className="historial-panel">
      <div className="historial-navbar">
        <Navbar />
      </div>
      <div className="historial-main">
        <div className="historial-title-wrap">
          <div className="historial-title-select-wrap">
            <h1>Historial de consultas del paciente:</h1>
            <select
              value={idPacienteSeleccionado}
              onChange={handlePacienteChange}
              className="historial-paciente-select"
              aria-label="Seleccionar paciente para historial"
            >
              <option value="">Selecciona un paciente</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id_paciente} value={paciente.id_paciente}>
                  {`${paciente.nombre} ${paciente.apellido}`}
                </option>
              ))}
            </select>
          </div>
          <button
            type="button"
            className="btn-exportar-historial"
            onClick={exportarHistorialXls}
            disabled={loading || !datos.length}
          >
            Descargar reporte (.xls)
          </button>
        </div>
        <div className="historial-user-header">
          <div className="historial-user-item">
            <span className="label">Nombre</span>
            <span className="value">{usuarioInfo.nombre}</span>
          </div>
          <div className="historial-user-item">
            <span className="label">Apellido</span>
            <span className="value">{usuarioInfo.apellido}</span>
          </div>
          <div className="historial-user-item">
            <span className="label">Cedula</span>
            <span className="value">{usuarioInfo.cedula}</span>
          </div>
          <div className="historial-user-item">
            <span className="label">Telefono</span>
            <span className="value">{usuarioInfo.telefono}</span>
          </div>
          <div className="historial-user-item">
            <span className="label">Direccion</span>
            <span className="value">{usuarioInfo.direccion}</span>
          </div>
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