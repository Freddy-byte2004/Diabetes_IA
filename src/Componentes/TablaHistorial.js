
import "../css/tablaHistorial.css";


function TablaHistorial({ data }) {
  

  return (
    <div className="contenedor-principal-tabla-historial">
      <div className="contenedor-tabla-historial">
        <table className="tabla-historia" border="1" style={{ borderCollapse: 'collapse', width: '100%' }}>
          <thead>
            <tr>
              
              <th>Glucosa</th>
              <th>IMB</th>
              <th>Insulina</th>
              <th>Numero de embarazos</th>
              <th>Presion arterial</th>
              <th>Grosor de piel</th>
              <th>Funcion de herencia</th>
              <th>Edad </th>
              <th>Probabilidad de padecer diabetes </th>
              <th>Fecha de analisis </th>
            </tr>
          </thead>
          <tbody>
            {data.map((historial, index) => (
              <tr key={index}>
                
                <td>{historial.glucosa}</td>
                <td>{historial.indice_de_masa_corporal}</td>
                <td>{historial.insulina}</td>
                <td>{historial.numero_de_embarazos}</td>
                <td>{historial.presion_arterial}</td>
                <td>{historial.grosor_de_piel}</td>
                <td>{historial.funcion_de_herencia}</td>
                <td>{historial.edad}</td>
                <td>{(historial.probabilidad_diabetes * 100).toFixed(2)}%</td>
                <td>{historial.fecha_de_analisis}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      
        
      
    </div>
  );
}

export default TablaHistorial;
