
import '../css/UsuarioPrincipal.css';
import {Navbar} from '../Componentes/Navbar';
import {ProbabilityDonut} from '../Componentes/barraDonat.js';
import { Barra } from '../Componentes/barra.js';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import AlertMessage from '../Componentes/AlertMessage.js';

import '../css/input.css'
function UsuarioPrincipal(){
   const [probability, setProbability] = useState(0);
   let ID_usuario;
    const hoy= new Date();
    const Fecha_de_analisis= hoy.toISOString().split('T')[0];
    const [pacientes, setPacientes] = useState([]);
    const [id_paciente, setId_paciente] = useState('');
    const [n_embarazos, setN_embarazos] = useState('');
    const [indice_glucosa, setIndice_glucosa] = useState('');
    const [presion_arterial, setPresion_arterial] = useState('');
    const [grosor_piel, setGrosor_piel] = useState('');
    const [nivel_insulina, setNivel_insulina] = useState('');
    const [indice_masa_corporal, setIndice_masa_corporal] = useState('');
    const [herencia_diabetica, setHerencia_diabetica] = useState('');
    const [edad, setEdad] = useState('');
    const [probabilidad_mensaje, setProbabilidad_mensaje] = useState(0);
    const [mensaje, setMensaje] = useState(''); 
    
    const [typeMessage,setTypeMessage]= useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    function setNumeroValidationMessage(event) {
        const { validity } = event.target;

        if (validity.valueMissing) {
            event.target.setCustomValidity('Completa este campo');
            return;
        }

        if (validity.badInput) {
            event.target.setCustomValidity('Ingresa un valor numerico');
            return;
        }

        event.target.setCustomValidity('');
    }

    function clearValidationMessage(event) {
        event.target.setCustomValidity('');
    }
    function handleN_embarazosChange(event) {
        setN_embarazos(event.target.value);
       
    }

    function handlePacienteChange(event) {
        setId_paciente(event.target.value);
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
        async function cargarDatosIniciales() {
            try {
                const pacientesResponse = await axios.get('https://diabetes-ia-backend-1.onrender.com/api/paciente');
                const pacientesData = Array.isArray(pacientesResponse.data) ? pacientesResponse.data : [];
                setPacientes(pacientesData);
            } catch (err) {
                console.error(err);
            }

        }
        cargarDatosIniciales();
    }, []);

    useEffect(() => {
        async function obtenerProbabilidadPacienteSeleccionado() {
            if (!id_paciente) {
                setProbability(0);
                setProbabilidad_mensaje(0);
                return;
            }

            try {
                const response = await axios.get(`https://diabetes-ia-backend-1.onrender.com/api/analisisProbabilidad/${id_paciente}`);

                if (response.data && response.data.probabilidad_diabetes !== undefined) {
                    const probabilidadPaciente = response.data.probabilidad_diabetes;
                    setProbability(probabilidadPaciente);
                    setProbabilidad_mensaje(probabilidadPaciente * 100);
                } else {
                    setProbability(0);
                    setProbabilidad_mensaje(0);
                }
            } catch (err) {
                console.error(err);
                setProbability(0);
                setProbabilidad_mensaje(0);
            }
        }

        obtenerProbabilidadPacienteSeleccionado();
    }, [id_paciente]);

    async function onSubmit(event) {  
        event.preventDefault();

        if (!id_paciente || n_embarazos === '' || indice_glucosa === '' || presion_arterial === '' || grosor_piel === '' || nivel_insulina === '' || indice_masa_corporal === '' || herencia_diabetica === '' || edad === '') {
            setMensaje('Completa todos los campos numericos');
            setTypeMessage('error');
            return;
        }

        if ([n_embarazos, indice_glucosa, presion_arterial, grosor_piel, nivel_insulina, indice_masa_corporal, herencia_diabetica, edad].some((valor) => Number.isNaN(Number(valor)))) {
            setMensaje('Ingresa valores numericos validos en todos los campos');
            setTypeMessage('error');
            return;
        }

        setIsSubmitting(true);
      
      
        try {
           
        
        } catch (err) {
            console.log(err);
            setMensaje("No se pudo obtener el usuario.");
            setTypeMessage("error");
            setIsSubmitting(false);
            return;
        }

        try {
            const res = await axios.post('https://diabetes-ia-backend-1.onrender.com/api/analisis', {
           
                id_paciente: Number(id_paciente),
                glucosa: Number(indice_glucosa),
                insulina: Number(nivel_insulina),
                numero_de_embarazos: Number(n_embarazos),
                presion_arterial: Number(presion_arterial),
                grosor_de_piel: Number(grosor_piel),
                indice_de_masa_corporal: Number(indice_masa_corporal),
                funcion_de_herencia: Number(herencia_diabetica),
                edad: Number(edad),
                fecha_de_analisis: Fecha_de_analisis
            });
            const nuevaProbabilidad = await axios.get(`https://diabetes-ia-backend-1.onrender.com/api/analisisProbabilidad/${id_paciente}`);
            if (nuevaProbabilidad.data && nuevaProbabilidad.data.probabilidad_diabetes !== undefined) {
                const Probabilidad = nuevaProbabilidad.data.probabilidad_diabetes;
                setProbability(Probabilidad);
                setProbabilidad_mensaje(Probabilidad * 100);
                setMensaje("Análisis realizado con éxito");
                setTypeMessage("success");
                console.log("nueva probabilidad", nuevaProbabilidad.data);
            } else {
                setMensaje("No se pudo realizar la consulta.");
                setTypeMessage("error");
                console.log("No se pudo realizar la consulta.");
            }
            console.log("respuesta del backend", res.data);
            console.log("nuevaProbabilidad", nuevaProbabilidad.data);
            console.log("Id_usuario", ID_usuario);
            console.log("probabilidad_mensaje", probabilidad_mensaje);
        } catch (err) {
            console.error(err);
            setMensaje("Error al conectar con el servidor");
            setTypeMessage("error");
        } finally {
            setIsSubmitting(false);
        }
    }
    return(

        <div className='Contenedor-principal'>
            <AlertMessage message={mensaje} type={typeMessage} onClose={() => setMensaje('')} />
            <div className='Pantalla-principal'>
                {isSubmitting && (
                    <div className='overlay-carga-prediccion' role='status' aria-live='polite'>
                        <div className='spinner-celeste-prediccion' aria-hidden='true'></div>
                        <p>Cargando datos...</p>
                    </div>
                )}
                <div className="navbar-container-dashboard">
                <Navbar />
                </div>
        
                <div className='contendor-formulario'>
                    
                    <form className='Formulario' onSubmit={onSubmit}>
                        <h1> Entrada de datos clinicos</h1>
                            <div className='unit-input-group select-paciente-group'>
                                <select value={id_paciente} onChange={handlePacienteChange} className='input-field input-con-unidad select-paciente' required>
                                    <option value=''>Selecciona un paciente</option>
                                    {pacientes.map((paciente) => (
                                        <option key={paciente.id_paciente} value={paciente.id_paciente}>
                                            {`${paciente.nombre} ${paciente.apellido}`}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Numero de embarazos" value={n_embarazos} onChange={handleN_embarazosChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                               
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Indice de glucosa" value={indice_glucosa} onChange={handleIndiceGlucosaChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                <span className='unit-suffix'>mg/dL</span>
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Presion arterial sistolica" value={presion_arterial} onChange={handlePresionArterialChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                <span className='unit-suffix'>mmHg</span>
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Grosor de la piel" value={grosor_piel} onChange={handleGrosorPielChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                <span className='unit-suffix'>mm</span>
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Nivel de insulina" value={nivel_insulina} onChange={handleNivelInsulinaChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                <span className='unit-suffix'>mu/mL</span>
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Indice de masa corporal" value={indice_masa_corporal} onChange={handleIndiceMasaCorporalChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                <span className='unit-suffix'>kg/m2</span>
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Funcion de herencia diabetica" value={herencia_diabetica} onChange={handleHerenciaDiabeticaChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Edad" value={edad} onChange={handleEdadChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                
                            </div>
                            <input type="submit" value="Enviar" className="boton-enviar" disabled={isSubmitting}/>
                    </form>
               
                </div>
                <div className='contenedor-grafica'> 
                    <h2>Resultado</h2>
                    <ProbabilityDonut probability={probability} />
                    {probability * 100 >= 50 ? (
                        <p className='resultado-negativo'>Alto riesgo de diabetes</p>
                    ) : (
                        <p className='resultado-positivo'>Bajo riesgo de diabetes</p>
                    )}
                </div>

                <div className='contenedor-grafica-barra'>
                    <Barra glucosa={Number(indice_glucosa)} insulina={Number(nivel_insulina)} bmi={Number(indice_masa_corporal)} />
                </div>
            
                
            </div>
            

        </div>






    )
}

export default UsuarioPrincipal;