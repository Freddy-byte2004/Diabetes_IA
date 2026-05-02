
import '../css/UsuarioPrincipal.css';
import {Navbar} from '../Componentes/Navbar';
import {ProbabilityDonut} from '../Componentes/barraDonat.js';
import { Barra } from '../Componentes/barra.js';
import { useMemo, useRef, useState } from 'react';
import { getAll as getAllPacientes } from '../services/pacienteService';
import { createAnalysis, getProbability } from '../services/analisisService';
import { useEffect } from 'react';
import AlertMessage from '../Componentes/AlertMessage.js';
import PedigreeCalculator from '../Componentes/PedigreeCalculator.js';

import '../css/input.css'
function UsuarioPrincipal(){
   const [probability, setProbability] = useState(0);
   let ID_usuario;
    const hoy= new Date();
    const Fecha_de_analisis= hoy.toISOString().split('T')[0];
    const [pacientes, setPacientes] = useState([]);
    const [id_paciente, setId_paciente] = useState('');
    const [busquedaPaciente, setBusquedaPaciente] = useState('');
    const [mostrarOpcionesPaciente, setMostrarOpcionesPaciente] = useState(false);
    const buscadorPacienteRef = useRef(null);
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

    const pacientesFiltrados = useMemo(() => {
        const termino = busquedaPaciente.trim().toLowerCase();
        if (!termino) {
            return pacientes;
        }

        return pacientes.filter((paciente) => {
            const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.toLowerCase();
            return nombreCompleto.includes(termino);
        });
    }, [pacientes, busquedaPaciente]);

    function seleccionarPaciente(pacienteSeleccionado) {
        const idSeleccionado = String(pacienteSeleccionado.id_paciente || '');
        const nombreCompleto = `${pacienteSeleccionado.nombre || ''} ${pacienteSeleccionado.apellido || ''}`.trim() || 'Paciente';
        setId_paciente(idSeleccionado);
        setBusquedaPaciente(nombreCompleto);
        setMostrarOpcionesPaciente(false);
    }

    function handlePacienteBusquedaChange(event) {
        setBusquedaPaciente(event.target.value);
        setId_paciente('');
        setMostrarOpcionesPaciente(true);
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

    function handlePedigreeCalculated(value) {
        setHerencia_diabetica(String(value));
    }

    function handleEdadChange(event) {
        setEdad(event.target.value);
       
    }
     useEffect(() => {
        async function cargarDatosIniciales() {
            try {
                const id_institucion = localStorage.getItem('id_institucion');
                const pacientesData = await getAllPacientes(id_institucion);
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
                const response = await getProbability(id_paciente);

                if (response && response.probabilidad_diabetes !== undefined) {
                    const probabilidadPaciente = response.probabilidad_diabetes;
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

    useEffect(() => {
        function handleClickFuera(event) {
            if (!buscadorPacienteRef.current?.contains(event.target)) {
                setMostrarOpcionesPaciente(false);
            }
        }

        document.addEventListener('mousedown', handleClickFuera);
        return () => {
            document.removeEventListener('mousedown', handleClickFuera);
        };
    }, []);

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
            const res = await createAnalysis({
           
                id_paciente: Number(id_paciente),
                glucosa: Number(indice_glucosa),
                insulina: Number(nivel_insulina),
                numero_de_embarazos: Number(n_embarazos),
                presion_arterial: Number(presion_arterial),
                grosor_de_piel: Number(grosor_piel),
                indice_de_masa_corporal: Number(indice_masa_corporal),
                funcion_de_herencia: Number(herencia_diabetica),
                edad: Number(edad),
                fecha_de_analisis: Fecha_de_analisis,
              
            });
            const nuevaProbabilidad = await getProbability(id_paciente);
            if (nuevaProbabilidad && nuevaProbabilidad.probabilidad_diabetes !== undefined) {
                const Probabilidad = nuevaProbabilidad.probabilidad_diabetes;
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
                                <div className='select-paciente-buscador' ref={buscadorPacienteRef}>
                                    <input
                                        type='text'
                                        value={busquedaPaciente}
                                        onChange={handlePacienteBusquedaChange}
                                        onFocus={() => setMostrarOpcionesPaciente(true)}
                                        className='input-field input-con-unidad select-paciente'
                                        placeholder='Selecciona o busca un paciente'
                                        autoComplete='off'
                                        aria-label='Seleccionar paciente'
                                    />
                                    {mostrarOpcionesPaciente && (
                                        <ul className='select-paciente-opciones' role='listbox'>
                                            {pacientesFiltrados.length > 0 ? (
                                                pacientesFiltrados.map((paciente) => {
                                                    const nombreCompleto = `${paciente.nombre || ''} ${paciente.apellido || ''}`.trim() || 'Paciente';
                                                    return (
                                                        <li
                                                            key={paciente.id_paciente}
                                                            role='option'
                                                            aria-selected={String(id_paciente) === String(paciente.id_paciente)}
                                                            tabIndex={0}
                                                            onMouseDown={() => seleccionarPaciente(paciente)}
                                                            onKeyDown={(event) => {
                                                                if (event.key === 'Enter') {
                                                                    seleccionarPaciente(paciente);
                                                                }
                                                            }}
                                                        >
                                                            {nombreCompleto}
                                                        </li>
                                                    );
                                                })
                                            ) : (
                                                <li className='select-paciente-sin-resultados' role='option' aria-selected='false' aria-disabled='true'>
                                                    Sin resultados
                                                </li>
                                            )}
                                        </ul>
                                    )}
                                </div>
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Numero de embarazos" value={n_embarazos} onChange={handleN_embarazosChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                               
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Indice de glucosa" value={indice_glucosa} onChange={handleIndiceGlucosaChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                <span className='unit-suffix'>mg/dL</span>
                            </div>
                            <div className='unit-input-group'>
                                <input type="number" placeholder="Presion arterial diastolica" value={presion_arterial} onChange={handlePresionArterialChange} className='input-field input-con-unidad' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
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
                                <div className='pedigree-field-row'>
                                    <input type="number" placeholder="Funcion de herencia diabetica" value={herencia_diabetica} onChange={handleHerenciaDiabeticaChange} className='input-field input-con-unidad pedigree-field-input' required onInvalid={setNumeroValidationMessage} onInput={clearValidationMessage} />
                                    <PedigreeCalculator onCalculated={handlePedigreeCalculated} />
                                </div>
                                
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