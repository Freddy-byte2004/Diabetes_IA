
import Tabla from "../Componentes/puta"
const data=[{
    nombre: "Juan",
    apellido: "Pérez",
    direccion: "Calle Falsa 123",
    telefono: "555-1234"
},]
function Perfil(){

    return(
        <div className="contenedor-principal">

            <Tabla data={data}/>
        </div>
    )


}

export default Perfil;