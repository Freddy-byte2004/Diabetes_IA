
import TablaHistorial from "../Componentes/TablaHistorial"
import {Navbar} from "../Componentes/Navbar"
import "../css/historial.css"
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { getAll as getAllPacientes } from "../services/pacienteService";
import { fetchFullHistorial, generateHistorialXlsBlob } from "../services/historialService";

function Historial(){
const [datos, setDatos]= useState([]);
const [nombreUsuario, setNombreUsuario] = useState('');
const [loading, setLoading] = useState(true);
const [pacientes, setPacientes] = useState([]);
const [idPacienteSeleccionado, setIdPacienteSeleccionado] = useState('');
const [busquedaPaciente, setBusquedaPaciente] = useState('');
const [mostrarOpcionesPaciente, setMostrarOpcionesPaciente] = useState(false);
const contenedorBuscadorRef = useRef(null);
const [usuarioInfo, setUsuarioInfo] = useState({
  nombre: 'Usuario',
  apellido: 'No disponible',
  telefono: 'No disponible',
  cedula: 'No disponible',
  direccion: 'No disponible'
});

const pacientesFiltrados = useMemo(() => {
  const termino = busquedaPaciente.trim().toLowerCase();
  if (!termino) {
    return pacientes;
  }

  return pacientes.filter((paciente) => {
    const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.toLowerCase();
    return nombreCompleto.includes(termino);
  });
}, [pacientes, busquedaPaciente]);

const seleccionarPaciente = (pacienteSeleccionado) => {
  const nuevoIdPaciente = String(pacienteSeleccionado.id_paciente || '');
  const nombreCompleto = `${pacienteSeleccionado.nombre || ''} ${pacienteSeleccionado.apellido || ''}`.trim() || 'Usuario';

  setIdPacienteSeleccionado(nuevoIdPaciente);
  localStorage.setItem('id_paciente_historial', nuevoIdPaciente);
  setNombreUsuario(nombreCompleto);
  setBusquedaPaciente(nombreCompleto);
  setMostrarOpcionesPaciente(false);
};

const handleBusquedaPacienteChange = (event) => {
  const nuevoValor = event.target.value;
  setBusquedaPaciente(nuevoValor);
  setMostrarOpcionesPaciente(true);

  if (!nuevoValor.trim()) {
    setIdPacienteSeleccionado('');
    localStorage.removeItem('id_paciente_historial');
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

      const idInstitucion = localStorage.getItem('id_institucion');
      const { paciente, analisis } = await fetchFullHistorial(idPacienteSeleccionado, idInstitucion);

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
  const handleClickFuera = (event) => {
    if (!contenedorBuscadorRef.current?.contains(event.target)) {
      setMostrarOpcionesPaciente(false);
    }
  };

  document.addEventListener('mousedown', handleClickFuera);
  return () => {
    document.removeEventListener('mousedown', handleClickFuera);
  };
}, []);

useEffect(() => {
  // Limpiar selección previa al cargar el módulo
  localStorage.removeItem('id_paciente_historial');
  const cargarPacientes = async () => {
    try {
      const idInstitucion = localStorage.getItem('id_institucion');
      const pacientesData = await getAllPacientes(idInstitucion);
      setPacientes(pacientesData);
      // No seleccionar ningún paciente por defecto
      setIdPacienteSeleccionado('');
      setBusquedaPaciente('');
    } catch (error) {
      console.error('Error al cargar pacientes:', error);
      setPacientes([]);
    }
  };
  cargarPacientes();
  // eslint-disable-next-line
}, []);

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
            <div className="historial-paciente-buscador" ref={contenedorBuscadorRef}>
              <input
                type="text"
                value={busquedaPaciente}
                onChange={handleBusquedaPacienteChange}
                onFocus={() => setMostrarOpcionesPaciente(true)}
                className="historial-paciente-select"
                placeholder="Selecciona o busca un paciente"
                aria-label="Seleccionar paciente para historial"
                autoComplete="off"
              />
              {mostrarOpcionesPaciente && (
                <ul className="historial-paciente-opciones" role="listbox">
                  {pacientesFiltrados.length > 0 ? (
                    pacientesFiltrados.map((paciente) => {
                      const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim();
                      return (
                        <li
                          key={paciente.id_paciente}
                          role="option"
                          aria-selected={String(idPacienteSeleccionado) === String(paciente.id_paciente)}
                          tabIndex={0}
                          onMouseDown={() => seleccionarPaciente(paciente)}
                          onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                              seleccionarPaciente(paciente);
                            }
                          }}
                        >
                          {nombreCompleto || 'Paciente'}
                        </li>
                      );
                    })
                  ) : (
                    <li className="historial-paciente-sin-resultados" role="option" aria-selected="false" aria-disabled="true">
                      Sin resultados
                    </li>
                  )}
                </ul>
              )}
            </div>
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