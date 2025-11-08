// editarDatos.jsx
import React, { useState } from "react";
import "../css/editarDatos.css";
import axios from "axios";

function EditarDatos({ usuario, onClose, onSave, actualizarDatos }) {
  const [formData, setFormData] = useState(usuario);

  const handleChange = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  };

  const handleSubmit = (e) => {
    e.preventDefault();
   axios.put(`https://diabetes-ia-backend-1.onrender.com/api/usuario/${usuario.id_usuario}`, {
  cedula: formData.cedula,          
  telefono: formData.telefono,
  direccion: formData.direccion
})
.then(response => {
  console.log("Datos actualizados:", response.data);
  onSave(response.data);
  actualizarDatos(); // Llama a la función para actualizar los datos en el componente padre
})
.catch(error => {
  console.error("Error al actualizar los datos:", error);
});
    onClose(); // Cierra el formulario
  };

  return (
    <div className="modal-edicion">
      <form onSubmit={handleSubmit}>
        <h3>Editar Usuario</h3>
        <label>Nombre: <input name="nombre" value={formData.nombre || ""} onChange={handleChange} /></label>
        <label>Apellido: <input name="apellido" value={formData.apellido || ""} onChange={handleChange} /></label>
        <label>Cédula: <input name="cedula" value={formData.cedula || ""} onChange={handleChange} /></label>
        <label>Dirección: <input name="direccion" value={formData.direccion || ""} onChange={handleChange} /></label>
        <label>Teléfono: <input name="telefono" value={formData.telefono || ""} onChange={handleChange} /></label>
        <button type="submit">Guardar</button>
        <button type="button" onClick={onClose}>Cancelar</button>
      </form>
    </div>
  );
}

export default EditarDatos;
