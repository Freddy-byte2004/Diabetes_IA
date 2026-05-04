import { useEffect, useState } from "react";
import { getAll, getById, createPatient, updatePatient, deletePatient } from "../services/pacienteService";
import { Navbar } from "../Componentes/Navbar";
import AlertMessage from "../Componentes/AlertMessage";
import "../css/pacientes.css";


const pacienteInicial = {
	nombre: "",
	apellido: "",
	cedula: "",
	telefono: "",
	direccion: "",
	sexo: "",
	grupo_sanguineo: "",
	fecha_de_nacimiento: "",
	fecha_de_diagnostico: ""
};

const normalizarFechaInput = (valor) => {
	if (!valor) {
		return "";
	}

	const fecha = new Date(valor);
	if (Number.isNaN(fecha.getTime())) {
		return "";
	}

	return fecha.toISOString().split("T")[0];
};

const formatearFechaVista = (valor) => {
	if (!valor) {
		return "No disponible";
	}

	const fecha = new Date(valor);
	if (Number.isNaN(fecha.getTime())) {
		return "No disponible";
	}

	return fecha.toLocaleDateString("es-ES");
};

const soloDigitos = (valor = "") => valor.replace(/\D/g, "");

const formatearTelefonoInput = (valor = "") => {
	const digitos = soloDigitos(valor).slice(0, 11);
	if (digitos.length <= 4) {
		return digitos;
	}

	return `${digitos.slice(0, 4)}-${digitos.slice(4)}`;
};

function Pacientes() {
	const [pacientes, setPacientes] = useState([]);
	const [busqueda, setBusqueda] = useState("");
	const [loading, setLoading] = useState(true);
	const [guardando, setGuardando] = useState(false);
	const [eliminandoId, setEliminandoId] = useState(null);
	const [modalAbierto, setModalAbierto] = useState(false);
	const [pacienteEditando, setPacienteEditando] = useState(null);
	const [formData, setFormData] = useState(pacienteInicial);
	const [mensaje, setMensaje] = useState("");
	const [tipoMensaje, setTipoMensaje] = useState("success");



	const cargarPacientes = async () => {
		setLoading(true);
		const idInstitucion = localStorage.getItem("id_institucion");
		try {
			const pacientesData = await getAll(idInstitucion);
			setPacientes(Array.isArray(pacientesData) ? pacientesData : []);
		} catch (error) {
			console.error("Error al cargar pacientes:", error);
			setPacientes([]);
			setMensaje("No se pudieron cargar los pacientes");
			setTipoMensaje("error");
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		cargarPacientes();
	}, []);

	const pacientesFiltrados = pacientes.filter((paciente) => {
		const nombreCompleto = `${paciente.nombre || ""} ${paciente.apellido || ""}`.toLowerCase();
		return nombreCompleto.includes(busqueda.trim().toLowerCase());
	});

	const abrirEdicion = async (idPaciente) => {
		try {
			const idInstitucion = localStorage.getItem("id_institucion");
			const pacienteRes = await getById(idPaciente, idInstitucion);
			const paciente = Array.isArray(pacienteRes)
				? (pacienteRes[0] || {})
				: (pacienteRes || {});

			setPacienteEditando(paciente);
			setModalAbierto(true);
			setFormData({
				nombre: paciente.nombre || "",
				apellido: paciente.apellido || "",
				cedula: soloDigitos(paciente.cedula || ""),
				telefono: formatearTelefonoInput(paciente.telefono || ""),
				direccion: paciente.direccion || "",
				sexo: paciente.sexo || "",
				grupo_sanguineo: paciente.grupo_sanguineo || "",
				fecha_de_nacimiento: normalizarFechaInput(paciente.fecha_de_nacimiento),
				fecha_de_diagnostico: normalizarFechaInput(paciente.fecha_de_diagnostico)
			});
		} catch (error) {
			console.error("Error al obtener paciente:", error);
			setMensaje("No se pudo cargar la información del paciente");
			setTipoMensaje("error");
		}
	};

	const abrirCreacion = () => {
		setPacienteEditando(null);
		setFormData(pacienteInicial);
		setModalAbierto(true);
	};

	const cerrarEdicion = () => {
		setModalAbierto(false);
		setPacienteEditando(null);
		setFormData(pacienteInicial);
	};

	const handleInputChange = (event) => {
		const { name, value } = event.target;

		if (name === "cedula") {
			setFormData((prev) => ({
				...prev,
				cedula: soloDigitos(value)
			}));
			return;
		}

		if (name === "telefono") {
			setFormData((prev) => ({
				...prev,
				telefono: formatearTelefonoInput(value)
			}));
			return;
		}

		setFormData((prev) => ({
			...prev,
			[name]: value
		}));
	};

	const guardarEdicion = async (event) => {
		event.preventDefault();

		setGuardando(true);
		try {
			const cedulaNumerica = soloDigitos(formData.cedula);
			const telefonoNumerico = soloDigitos(formData.telefono);

			if (!cedulaNumerica) {
				setMensaje("La cédula solo debe contener números");
				setTipoMensaje("error");
				return;
			}

			if (telefonoNumerico.length !== 11) {
				setMensaje("El teléfono debe contener 11 dígitos (ejemplo: 0414-1234567)");
				setTipoMensaje("error");
				return;
			}

			const payload = {
				cedula: cedulaNumerica,
				nombre: formData.nombre,
				apellido: formData.apellido,
				direccion: formData.direccion,
				telefono: telefonoNumerico,
				sexo: formData.sexo,
				grupo_sanguineo: formData.grupo_sanguineo,
				fecha_de_nacimiento: formData.fecha_de_nacimiento,
				fecha_de_diagnostico: formData.fecha_de_diagnostico
			};

			if (pacienteEditando?.id_paciente) {
				await updatePatient(pacienteEditando.id_paciente, payload);
				setMensaje("Paciente actualizado correctamente");
			} else {
							 const idInstitucion = localStorage.getItem("id_institucion");
							 const idInstitucionNum = Number(idInstitucion);
							 if (!idInstitucion || isNaN(idInstitucionNum) || idInstitucionNum <= 0) {
								 setMensaje("No se encontró una institución válida para el usuario. Por favor, vuelve a iniciar sesión.");
								 setTipoMensaje("error");
								 return;
							 }
							 await createPatient({
								 ...payload,
								 id_institucion: idInstitucionNum
							 });
							 setMensaje("Paciente creado correctamente");
			}

			await cargarPacientes();
			cerrarEdicion();
			setTipoMensaje("success");
		} catch (error) {
			console.error("Error al guardar paciente:", error);
			setMensaje(
				pacienteEditando?.id_paciente
					? "No se pudo actualizar el paciente"
					: "No se pudo crear el paciente"
			);
			setTipoMensaje("error");
		} finally {
			setGuardando(false);
		}
	};

	const eliminarPaciente = async (idPaciente, nombrePaciente) => {
		const confirmar = window.confirm(`¿Deseas eliminar a ${nombrePaciente}? Esta acción no se puede deshacer.`);

		if (!confirmar) {
			return;
		}

		setEliminandoId(idPaciente);
		try {
			await deletePatient(idPaciente);
			await cargarPacientes();
			setMensaje("Paciente eliminado correctamente");
			setTipoMensaje("success");

			if (pacienteEditando?.id_paciente === idPaciente) {
				cerrarEdicion();
			}
		} catch (error) {
			console.error("Error al eliminar paciente:", error);
			setMensaje("No se pudo eliminar el paciente");
			setTipoMensaje("error");
		} finally {
			setEliminandoId(null);
		}
	};

	return (
		<div className="pacientes-page">
			<AlertMessage message={mensaje} type={tipoMensaje} onClose={() => setMensaje("")} />

			<div className="pacientes-panel">
				<div className="pacientes-navbar">
					<Navbar />
				</div>

				<div className="pacientes-main">
					<div className="pacientes-header">
						<div>
							<h1>Gestión de pacientes</h1>
							<p>Consulta, filtra, edita y elimina pacientes registrados en el sistema.</p>
						</div>

						<div className="pacientes-kpi-card">
							<span className="pacientes-kpi-label">Total de pacientes</span>
							<strong className="pacientes-kpi-value">{pacientes.length}</strong>
						</div>
					</div>

					<div className="pacientes-toolbar">
						<div className="pacientes-search-box">
							<label htmlFor="buscador-pacientes">Buscar por nombre</label>
							<input
								id="buscador-pacientes"
								type="text"
								placeholder="Escribe el nombre del paciente"
								value={busqueda}
								onChange={(event) => setBusqueda(event.target.value)}
							/>
						</div>

						<div className="pacientes-toolbar-actions">
							<div className="pacientes-resumen-filtro">
								<span>Mostrando</span>
								<strong>{pacientesFiltrados.length}</strong>
								<span>pacientes</span>
							</div>
							<button type="button" className="btn-primario pacientes-btn-crear" onClick={abrirCreacion}>
								Nuevo paciente
							</button>
						</div>
					</div>

					<div className="pacientes-table-wrap">
						{loading ? (
							<div className="pacientes-loader" role="status" aria-live="polite">
								<div className="spinner-celeste" aria-hidden="true"></div>
								<p>Cargando pacientes...</p>
							</div>
						) : pacientesFiltrados.length > 0 ? (
							<div className="pacientes-table-scroll">
								<table className="pacientes-table">
									<thead>
										<tr>
											<th>Cédula</th>
											<th>Nombre</th>
											<th>Apellido</th>
											<th>Dirección</th>
											<th>Teléfono</th>
											<th>Sexo</th>
											<th>Grupo sanguíneo</th>
											<th>Fecha de nacimiento</th>
											<th>Fecha de diagnóstico</th>
											<th>Acciones</th>
										</tr>
									</thead>
									<tbody>
										{pacientesFiltrados.map((paciente) => {
											const nombreCompleto = `${paciente.nombre || ""} ${paciente.apellido || ""}`.trim() || "Paciente";

											return (
												<tr key={paciente.id_paciente}>
													<td>{paciente.cedula || "No disponible"}</td>
													<td>{paciente.nombre || "No disponible"}</td>
													<td>{paciente.apellido || "No disponible"}</td>
													<td>{paciente.direccion || "No disponible"}</td>
													<td>{paciente.telefono || "No disponible"}</td>
													<td>{paciente.sexo || "No disponible"}</td>
													<td>{paciente.grupo_sanguineo || "No disponible"}</td>
													<td>{formatearFechaVista(paciente.fecha_de_nacimiento)}</td>
													<td>{formatearFechaVista(paciente.fecha_de_diagnostico)}</td>
													<td>
														<div className="pacientes-actions">
															<button
																type="button"
																className="btn-tabla btn-editar"
																onClick={() => abrirEdicion(paciente.id_paciente)}
															>
																Editar
															</button>
															<button
																type="button"
																className="btn-tabla btn-eliminar"
																onClick={() => eliminarPaciente(paciente.id_paciente, nombreCompleto)}
																disabled={eliminandoId === paciente.id_paciente}
															>
																{eliminandoId === paciente.id_paciente ? "Eliminando..." : "Eliminar"}
															</button>
														</div>
													</td>
												</tr>
											);
										})}
									</tbody>
								</table>
							</div>
						) : (
							<p className="pacientes-empty">No se encontraron pacientes con ese nombre.</p>
						)}
					</div>
				</div>
			</div>

			{modalAbierto && (
				<div className="pacientes-modal-overlay" onClick={cerrarEdicion}>
					<div className="pacientes-modal" onClick={(event) => event.stopPropagation()}>
						<div className="pacientes-modal-header">
							<div>
								<h2>{pacienteEditando ? "Editar paciente" : "Nuevo paciente"}</h2>
								<p>
									{pacienteEditando
										? "Actualiza los datos clínicos y de contacto del paciente seleccionado."
										: "Registra un nuevo paciente en el sistema con sus datos principales."}
								</p>
							</div>
							<button type="button" className="pacientes-modal-close" onClick={cerrarEdicion}>
								×
							</button>
						</div>

						<form className="pacientes-form" onSubmit={guardarEdicion}>
							<label>
								Cédula
								<input
									name="cedula"
									value={formData.cedula}
									onChange={handleInputChange}
									inputMode="numeric"
									pattern="[0-9]+"
									title="La cédula solo debe contener números"
									required
								/>
							</label>

							<label>
								Nombre
								<input name="nombre" value={formData.nombre} onChange={handleInputChange} required />
							</label>

							<label>
								Apellido
								<input name="apellido" value={formData.apellido} onChange={handleInputChange} required />
							</label>

							<label>
								Teléfono
								<input
									name="telefono"
									value={formData.telefono}
									onChange={handleInputChange}
									placeholder="0414-1234567"
									inputMode="numeric"
									maxLength={12}
									pattern="[0-9]{4}-[0-9]{7}"
									title="Formato requerido: 0414-1234567"
									required
								/>
							</label>

							<label>
								Sexo
								<select name="sexo" value={formData.sexo} onChange={handleInputChange} required>
									<option value="">Selecciona</option>
									<option value="Masculino">Masculino</option>
									<option value="Femenino">Femenino</option>
									<option value="Otro">Otro</option>
								</select>
							</label>

							<label>
								Grupo sanguineo
								<select name="grupo_sanguineo" value={formData.grupo_sanguineo} onChange={handleInputChange} required>
									<option value="">Selecciona</option>
									<option value="A+">A+</option>
									<option value="A-">A-</option>
									<option value="B+">B+</option>
									<option value="B-">B-</option>
									<option value="AB+">AB+</option>
									<option value="AB-">AB-</option>
									<option value="O+">O+</option>
									<option value="O-">O-</option>
								</select>
							</label>

							<label className="pacientes-form-full">
								Dirección
								<input name="direccion" value={formData.direccion} onChange={handleInputChange} required />
							</label>

							<label>
								Fecha de nacimiento
								<input
									type="date"
									name="fecha_de_nacimiento"
									value={formData.fecha_de_nacimiento}
									onChange={handleInputChange}
									required
								/>
							</label>

							<label>
								Fecha de diagnóstico
								<input
									type="date"
									name="fecha_de_diagnostico"
									value={formData.fecha_de_diagnostico}
									onChange={handleInputChange}
									required
								/>
							</label>

							<div className="pacientes-form-actions pacientes-form-full">
								<button type="button" className="btn-secundario" onClick={cerrarEdicion}>
									Cancelar
								</button>
								<button type="submit" className="btn-primario" disabled={guardando}>
									{guardando ? "Guardando..." : "Guardar cambios"}
								</button>
							</div>
						</form>
					</div>
				</div>
			)}
		</div>
	);
}

export default Pacientes;
