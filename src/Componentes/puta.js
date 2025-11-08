import React, { useState } from "react";
import "../css/tabla.css";
import EditarDatos from "./editarDatos";

function Tabla({ data, onDatosActualizados }) {
  const [usuarioEditando, setUsuarioEditando] = useState(null);

  const handleEditar = (persona) => {
    setUsuarioEditando(persona);
  };

  const handleCerrar = () => {
    setUsuarioEditando(null);
  };

  const handleGuardar = (datosActualizados) => {
    console.log("Datos actualizados:", datosActualizados);
    // Aquí puedes hacer el PUT al backend si lo deseas
  };

  return (
    <div className="contenedor-principal-tabla">
      <div className="contenedor-tabla">
        <table border="1" style={{ borderCollapse: 'collapse', width: '70%' }}>
          <thead>
            <tr>
              
              <th>Nombre</th>
              <th>Apellido</th>
              <th>Cedula</th>
              <th>Direccion</th>
              <th>Telefono</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((persona, index) => (
              <tr key={index}>
                
                <td>{persona.nombre}</td>
                <td>{persona.apellido}</td>
                <td>{persona.cedula}</td>
                <td>{persona.direccion}</td>
                <td>{persona.telefono}</td>
                <td>
                  <button className="editar-usuario" onClick={() => handleEditar(persona)}>Editar</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {usuarioEditando && (
        <EditarDatos
          usuario={usuarioEditando}
          onClose={handleCerrar}
          onSave={handleGuardar}
          actualizarDatos={onDatosActualizados}
        />
      )}
    </div>
  );
}

export default Tabla;
