
import '../css/UsuarioPrincipal.css';
import {Navbar} from '../Componentes/Navbar';
import {ProbabilityDonut} from '../Componentes/barraDonat.js';
import { Barra } from '../Componentes/barra.js';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import '../css/input.css'
function UsuarioPrincipal(){
   const [probability, setProbability] = useState(0);
   let ID_usuario;
    const hoy= new Date();
    const Fecha_de_analisis= hoy.toISOString().split('T')[0];
    const [n_embarazos, setN_embarazos] = useState();
    const [indice_glucosa, setIndice_glucosa] = useState();
    const [presion_arterial, setPresion_arterial] = useState();
    const [grosor_piel, setGrosor_piel] = useState();
    const [nivel_insulina, setNivel_insulina] = useState();
    const [indice_masa_corporal, setIndice_masa_corporal] = useState();
    const [herencia_diabetica, setHerencia_diabetica] = useState();
    const [edad, setEdad] = useState();
    const [Id_usuario, setId_usuario] = useState();

    function handleN_embarazosChange(event) {
        setN_embarazos(event.target.value);
       
    }

    function handleIndiceGlucosaChange(event) {
        setIndice_glucosa(event.target.value);
    }

    function handlePresionArterialChange(event) {
        setPresion_arterial(event.target.value);
    }

    function handleGrosorPielChange(event) {
        setGrosor_piel(event.target.value);
    }

    function handleNivelInsulinaChange(event) {
        setNivel_insulina(event.target.value);
    }

    function handleIndiceMasaCorporalChange(event) {
        setIndice_masa_corporal(event.target.value);
    }

    function handleHerenciaDiabeticaChange(event) {
        setHerencia_diabetica(event.target.value);
    }

    function handleEdadChange(event) {
        setEdad(event.target.value);
       
    }
     useEffect(() => {
        async function obtenerProbability() {
            const correo = localStorage.getItem('correo_usuario');
            try {
                const id_usuario_axios = await axios.get(`http://localhost:3001/api/usuario/${correo}`);
                const id_usuario= id_usuario_axios.data.id_usuario
                console.log("id usuario", id_usuario);

                const res = await axios.get(`http://localhost:3001/api/analisisProbabilidad/${id_usuario}`);
                // Supón que el backend retorna un array de análisis, tomas el último
                if (res.data) {
                    const Probabilidad = res.data.Probabilidad_diabetes;
                   console.log("probabilidad obtenida", Probabilidad);
                   setProbability(Probabilidad);
                }
                else{

                }
            } catch (err) {
                console.error(err);
            }
        }
        obtenerProbability();
    }, []);
    async function onSubmit(event) {  
        event.preventDefault();//obtener id_usuario, luego llamar a la ia y obtener probabilidad de diabates y una vez todo mandar al backend todo
        const correo= localStorage.getItem('correo_usuario');
        console.log("correo_usuario", correo);
        try{
                const id_usuario_axios= await axios.get(`http://localhost:3001/api/usuario/${correo}`)
                console.log("id usuario", id_usuario_axios.data.id_usuario);
                 ID_usuario= id_usuario_axios.data.id_usuario;
                setId_usuario(id_usuario_axios.data.id_usuario);
        }catch(err){
            console.log(err);
        }
        try{
           const res= await axios.post('http://localhost:3001/api/analisis',{
            id_usuario: ID_usuario,
            glucosa: Number(indice_glucosa),
            insulina: Number(nivel_insulina),
            numero_de_embarazos: Number(n_embarazos),
            presion_arterial: Number(presion_arterial),
            grosor_de_piel: Number(grosor_piel),
            indice_de_masa_corporal: Number(indice_masa_corporal),
            funcion_de_herencia: Number(herencia_diabetica),
            edad: Number(edad),
            fecha_de_analisis: Fecha_de_analisis
           })
           const nuevaProbabilidad = await axios.get(`http://localhost:3001/api/analisisProbabilidad/${Id_usuario}`);
        if (nuevaProbabilidad.data) {
            const Probabilidad = nuevaProbabilidad.data.Probabilidad_diabetes;
            setProbability(Probabilidad);
        }
              console.log("respuesta del backend", res.data);
              
             
        }catch(err){
            console.error(err);
        }
    }
    return(

        <div className='Contenedor-principal'>
            <div className='Pantalla-principal'>
                <div className="navbar-container">
                <Navbar />
                </div>
                
                <div className='contendor-formulario'>
                    
                    <form className='Formulario' onSubmit={onSubmit}>
                        <h1> Entrada de datos clinicos</h1>
                            <input type="number" placeholder="Numero de embarazos" value={n_embarazos} onChange={handleN_embarazosChange} />
                            <input type="number" placeholder="Indice de glucosa" value={indice_glucosa} onChange={handleIndiceGlucosaChange} />
                            <input type="number" placeholder="Presion arterial" value={presion_arterial} onChange={handlePresionArterialChange} />
                            <input type="number" placeholder="Grosor de la piel" value={grosor_piel} onChange={handleGrosorPielChange} />
                            <input type="number" placeholder="Nivel de insulina" value={nivel_insulina} onChange={handleNivelInsulinaChange} />
                            <input type="number" placeholder="Indice de masa corporal" value={indice_masa_corporal} onChange={handleIndiceMasaCorporalChange} />
                            <input type="number" placeholder="Funcion de herencia diabetica" value={herencia_diabetica} onChange={handleHerenciaDiabeticaChange} />
                            <input type="number" placeholder="Edad" value={edad} onChange={handleEdadChange} />
                            <input type="submit" value="Enviar" className="boton-enviar"/>
                    </form>
               
                </div>
                <div className='contenedor-grafica'> 
                    <h2>Resultado</h2>
                    <ProbabilityDonut probability={probability} />
                    {probability>=50? <p className='resultado-negativo'>Alto riesgo de diabetes</p> : <p className='resultado-positivo'>Bajo riesgo de diabetes</p>}
                </div>

                <div className='contenedor-grafica-barra'>
                    <Barra glucosa={Number(indice_glucosa)} insulina={Number(nivel_insulina)} bmi={Number(indice_masa_corporal)} />
                </div>
                
            </div>
            

        </div>






    )
}

export default UsuarioPrincipal;