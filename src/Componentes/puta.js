
import React from "react";
import "../css/tabla.css";
function Tabla({data}) {


    return(
        <div className="contenedor-principal-tabla">
          <div className="contenedor-tabla">
            <table border="1" style={{ borderCollapse: 'collapse', width: '70%' }}>
      <thead>
        <tr>
          <th>Nombre</th>
          <th>Apellido</th>
          <th>Direccion</th>
          <th>Telefono</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {data.map((persona,index) => (
          <tr key={index}>
          
            <td>{persona.nombre}</td>
            <td>{persona.apellido}</td>
            <td>{persona.direccion}</td>
            <td>{persona.telefono}</td>
            <td><button className="editar-usuario">Editar</button></td>
          </tr>
        ))}
      </tbody>
    </table>
          </div>
        </div>
    )

}

export default Tabla;