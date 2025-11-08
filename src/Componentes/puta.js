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
    
  };

  return (
    <div className="contenedor-principal-tabla">
      <div className="contenedor-tabla">
        <table border="1" style={{ borderCollapse: 'collapse', width: '70%' }}>
          <thead>
            <tr>
              
              <th className="nombre">Nombre</th>
              <th className="apellido">Apellido</th>
              <th className="cedula">Cedula</th>
              <th className="direccion">Direccion</th>
              <th className="telefono">Telefono</th>
              <th className="acciones">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {data.map((persona, index) => (
              <tr key={index}>
                <td className="nombre-fila">{persona.nombre}</td>
                <td className="apellido-fila">{persona.apellido}</td>
                <td className="cedula-fila">{persona.cedula}</td>
                <td className="direccion-fila">{persona.direccion}</td>
                <td className="telefono-fila">{persona.telefono}</td>
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
