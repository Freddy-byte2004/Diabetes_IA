
    import Tabla from "../Componentes/puta"
    import {Navbar} from "../Componentes/Navbar"
    import "../css/perfil.css"
    import { useCallback, useEffect, useState } from "react";
    import axios from "axios";

    function Perfil(){
    const [datos, setDatos]= useState([]);
    const [loading, setLoading] = useState(true);

    const correo= localStorage.getItem("correo_usuario");

        const obtenerDatos=useCallback(async ()=>{
            setLoading(true);
            try {
                if (!correo) {
                    setDatos([]);
                    return;
                }

                const usuarioPorCorreo = await axios.get(`https://diabetes-ia-backend-1.onrender.com/api/usuario/correo/${correo}`);
                const usuarioRespuesta = await axios.get(`https://diabetes-ia-backend-1.onrender.com/api/usuario/${usuarioPorCorreo.data.id_usuario}`);

                const usuarioData= usuarioRespuesta.data[0];
                const formattedData= [{
                    id_usuario: usuarioData.id_usuario,
                    nombre: usuarioData.nombre,
                    apellido: usuarioData.apellido,
                    cedula: usuarioData.cedula,
                    direccion: usuarioData.direccion,
                    telefono: usuarioData.telefono
                }];
                setDatos(formattedData);
                console.log('Datos del usuario:', formattedData[0]);
            } catch (err) {
                console.error('Error al obtener los datos del usuario:', err);
                setDatos([]);
            } finally {
                setLoading(false);
            }
    }, [correo])

    useEffect(()=>{
        obtenerDatos();
    },[obtenerDatos])
        return(
            <div className="perfil-page">
            <div className="perfil-panel">
                <div className="perfil-navbar"><Navbar/></div>
                <div className="perfil-main">
                    <div className="perfil-title"><h1>Datos del usuario</h1></div>
                                        <div className="perfil-table-wrap">
                                            {loading ? (
                                                <div className="perfil-loader" role="status" aria-live="polite">
                                                    <div className="spinner-celeste" aria-hidden="true"></div>
                                                    <p>Cargando datos...</p>
                                                </div>
                                            ) : datos.length > 0 ? (
                                                <Tabla data={datos} onDatosActualizados={obtenerDatos}/>
                                            ) : (
                                                <p className="mensaje-vacio">No se encontraron datos del usuario</p>
                                            )}
                                        </div>
                
                </div>
                
                
            </div>
            </div>
        )


    }

    export default Perfil;