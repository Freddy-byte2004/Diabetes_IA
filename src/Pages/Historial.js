
import TablaHistorial from "../Componentes/TablaHistorial"
import {Navbar} from "../Componentes/Navbar"
import "../css/historial.css"
import { useCallback, useEffect, useState } from "react";
import axios from "axios";

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
  if (!datos.length) {
    return;
  }

  const columnas = [
    "Glucosa",
    "Indice de masa corporal",
    "Insulina",
    "Numero de embarazos",
    "Presion arterial",
    "Grosor de piel",
    "Funcion de herencia",
    "Edad",
    "Probabilidad de diabetes",
    "Fecha de analisis"
  ];

  const escaparHtml = (valor) => String(valor ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

  const filasHtml = datos
    .map((historial) => `
      <tr>
        <td>${escaparHtml(historial.glucosa)}</td>
        <td>${escaparHtml(historial.indice_de_masa_corporal)}</td>
        <td>${escaparHtml(historial.insulina)}</td>
        <td>${escaparHtml(historial.numero_de_embarazos)}</td>
        <td>${escaparHtml(historial.presion_arterial)}</td>
        <td>${escaparHtml(historial.grosor_de_piel)}</td>
        <td>${escaparHtml(historial.funcion_de_herencia)}</td>
        <td>${escaparHtml(historial.edad)}</td>
         <td>${escaparHtml((historial.probabilidad_diabetes * 100).toFixed(2) + "%")}</td>
        <td>${escaparHtml(historial.fecha_de_analisis)}</td>
      </tr>
    `)
    .join("");

  const fechaReporte = new Date().toISOString().split("T")[0];

  const contenidoHtml = `
    <html>
      <head>
        <meta charset="UTF-8" />
        <style>
          body {
            font-family: Calibri, Arial, sans-serif;
            color: #173a56;
            margin: 0;
            padding: 18px;
            background: #f6fbff;
          }
          .reporte {
            background: #ffffff;
            border: 1px solid #d7e6f4;
            border-radius: 10px;
            padding: 16px;
          }
          .kpis {
            margin: 8px 0 14px;
          }
          .kpis td {
            border: 1px solid #d6e6f5;
            border-radius: 7px;
            padding: 8px 10px;
            background: #f2f8fe;
            font-size: 13px;
            text-align: center;
          }
          .tabla-registros {
            border-collapse: collapse;
            width: 100%;
            margin-top: 10px;
          }
          .tabla-registros .encabezado-reporte th {
            background: linear-gradient(90deg, #2e7db4 0%, #4d97ca 100%);
            color: #ffffff;
            text-align: center;
            font-size: 22px;
            font-weight: 700;
            letter-spacing: 0.2px;
            padding: 12px 8px;
          }
          .tabla-registros .encabezado-reporte .subtitulo {
            display: block;
            margin-top: 4px;
            font-size: 12px;
            font-weight: 500;
            opacity: 0.95;
          }
          .tabla-registros .encabezado-usuario th {
            background: #eef5fc;
            color: #1c4a70;
            text-align: center;
            font-size: 16px;
            font-weight: 700;
            line-height: 1.55;
            padding: 12px 10px;
          }
          .tabla-registros .encabezado-usuario .dato {
            display: inline-block;
            margin: 2px 0;
            padding: 0 8px;
            white-space: nowrap;
          }
          .tabla-registros .encabezado-usuario .separador {
            display: inline-block;
            color: #5b7f9f;
            font-weight: 700;
            margin: 0 2px;
          }
          .tabla-registros th, .tabla-registros td {
            border: 1px solid #c8d9ea;
            padding: 7px 8px;
            text-align: center;
            font-size: 12px;
          }
          .tabla-registros thead {
            background: #d9eaf8;
            color: #1c4668;
          }
          .tabla-registros tbody tr:nth-child(even) {
            background: #f7fbff;
          }
        </style>
      </head>
      <body>
        <div class="reporte">
          <table class="tabla-registros">
            <thead>
              <tr class="encabezado-reporte">
                <th colspan="${columnas.length}">
                  Reporte de Historial Clinico
                  <span class="subtitulo">Sistema Diabetes IA - Fecha de emision: ${escaparHtml(fechaReporte)}</span>
                </th>
              </tr>
              <tr class="encabezado-usuario">
                <th colspan="${columnas.length}">
                  <span class="dato"><strong>Nombre:</strong> ${escaparHtml(usuarioInfo.nombre)}</span>
                  <span class="separador">|</span>
                  <span class="dato"><strong>Apellido:</strong> ${escaparHtml(usuarioInfo.apellido)}</span>
                  <span class="separador">|</span>
                  <span class="dato"><strong>Cedula:</strong> ${escaparHtml(usuarioInfo.cedula)}</span>
                  <span class="separador">|</span>
                  <span class="dato"><strong>Telefono:</strong> ${escaparHtml(usuarioInfo.telefono)}</span>
                  <span class="separador">|</span>
                  <span class="dato"><strong>Direccion:</strong> ${escaparHtml(usuarioInfo.direccion)}</span>
                  <span class="separador">|</span>
                  <span class="dato"><strong>Fecha del reporte:</strong> ${escaparHtml(fechaReporte)}</span>
                </th>
              </tr>
              <tr>${columnas.map((columna) => `<th>${columna}</th>`).join("")}</tr>
            </thead>
            <tbody>
              ${filasHtml}
            </tbody>
          </table>
        </div>
      </body>
    </html>
  `;

  const blob = new Blob(["\ufeff", contenidoHtml], {
    type: "application/vnd.ms-excel;charset=utf-8;"
  });

  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  const nombre = (nombreUsuario || "usuario").replace(/\s+/g, "_").toLowerCase();

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

    const [resPaciente, resAnalisis] = await Promise.all([
      axios.get(`https://diabetes-ia-backend-1.onrender.com/api/paciente/${idPacienteSeleccionado}`),
      axios.get(`https://diabetes-ia-backend-1.onrender.com/api/analisis/${idPacienteSeleccionado}`)
    ]);

    const paciente = Array.isArray(resPaciente.data)
      ? (resPaciente.data[0] || {})
      : (resPaciente.data || {});
    const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim();
    setNombreUsuario(nombreCompleto || 'Usuario');
    setUsuarioInfo({
      nombre: paciente.nombre || 'Usuario',
      apellido: paciente.apellido || 'No disponible',
      telefono: paciente.telefono || 'No disponible',
      cedula: paciente.cedula || 'No disponible',
      direccion: paciente.direccion || 'No disponible'
    });

    const analisisData = Array.isArray(resAnalisis.data) ? resAnalisis.data : [];
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
      const pacientesResponse = await axios.get('https://diabetes-ia-backend-1.onrender.com/api/paciente');
      const pacientesData = Array.isArray(pacientesResponse.data) ? pacientesResponse.data : [];
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