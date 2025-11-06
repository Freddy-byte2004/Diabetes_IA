
import React from "react";
function Tabla({data}) {


    return(
        <div className="contenedor-principal-tabla">

            <table border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Direccion</th>
          <th>Telefono</th>
        </tr>
      </thead>
      <tbody>
        {data.map((persona) => (
          <tr key={persona.id}>
            <td>{persona}</td>
            <td>{persona.nombre}</td>
            <td>{persona.apellido}</td>
            <td>{persona.direccion}</td>
            <td>{persona.telefono}</td>
          </tr>
        ))}
      </tbody>
    </table>

        </div>
    )

}

export default Tabla;