import { getById as getPacienteById } from "./pacienteService";
import { getByPaciente as getAnalisisByPaciente } from "./analisisService";

const escaparHtml = (valor) => String(valor ?? "")
  .replace(/&/g, "&amp;")
  .replace(/</g, "&lt;")
  .replace(/>/g, "&gt;")
  .replace(/"/g, "&quot;")
  .replace(/'/g, "&#39;");

export async function getHistorialByPaciente(idPaciente) {
  if (!idPaciente) return [];
  const res = await getAnalisisByPaciente(idPaciente);
  // Normalizar respuesta: algunos servicios devuelven { data: [...] } y otros ya devuelven el array
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (res.data && Array.isArray(res.data)) return res.data;
  return [];
}

export async function getPacienteInfo(idPaciente, idInstitucion) {
  if (!idPaciente) return null;
  if (!idInstitucion) return null;
  const res = await getPacienteById(idPaciente, idInstitucion);
  if (!res) return null;
  if (Array.isArray(res)) return res[0] || null;
  return res;
}

export async function fetchFullHistorial(idPaciente, idInstitucion) {
  const [pacienteRaw, analisisRaw] = await Promise.all([
    getPacienteInfo(idPaciente, idInstitucion),
    getHistorialByPaciente(idPaciente),
  ]);

  return {
    paciente: pacienteRaw || null,
    analisis: Array.isArray(analisisRaw) ? analisisRaw : [],
  };
}

export function generateHistorialXlsBlob(datos = [], usuarioInfo = {}, nombreUsuario = "usuario") {
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
    "Fecha de analisis",
  ];

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
        <td>${escaparHtml((Number(historial.probabilidad_diabetes) * 100).toFixed(2) + "%")}</td>
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
          body { font-family: Calibri, Arial, sans-serif; color: #173a56; margin: 0; padding: 18px; background: #f6fbff; }
          .reporte { background: #ffffff; border: 1px solid #d7e6f4; border-radius: 10px; padding: 16px; }
          .tabla-registros { border-collapse: collapse; width: 100%; margin-top: 10px; }
          .tabla-registros th, .tabla-registros td { border: 1px solid #c8d9ea; padding: 7px 8px; text-align: center; font-size: 12px; }
          .tabla-registros thead { background: #d9eaf8; color: #1c4668; }
          .tabla-registros tbody tr:nth-child(even) { background: #f7fbff; }
        </style>
      </head>
      <body>
        <div class="reporte">
          <table class="tabla-registros">
            <thead>
              <tr>
                <th colspan="${columnas.length}">
                  Reporte de Historial Clinico
                  <div style="font-size:12px;margin-top:6px;">Sistema Diabetes IA - Fecha de emision: ${escaparHtml(fechaReporte)}</div>
                </th>
              </tr>
              <tr>
                <th colspan="${columnas.length}">
                  <strong>Nombre:</strong> ${escaparHtml(usuarioInfo.nombre || nombreUsuario)} &nbsp; | &nbsp;
                  <strong>Apellido:</strong> ${escaparHtml(usuarioInfo.apellido || "No disponible")} &nbsp; | &nbsp;
                  <strong>Cedula:</strong> ${escaparHtml(usuarioInfo.cedula || "No disponible")} &nbsp; | &nbsp;
                  <strong>Telefono:</strong> ${escaparHtml(usuarioInfo.telefono || "No disponible")} &nbsp; | &nbsp;
                  <strong>Direccion:</strong> ${escaparHtml(usuarioInfo.direccion || "No disponible")}
                </th>
              </tr>
              <tr>${columnas.map((col) => `<th>${col}</th>`).join("")}</tr>
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
    type: "application/vnd.ms-excel;charset=utf-8;",
  });

  return blob;
}

export default {
  getHistorialByPaciente,
  getPacienteInfo,
  fetchFullHistorial,
  generateHistorialXlsBlob,
};
