
import React, { useState } from "react";
import { createPortal } from "react-dom";
import "../css/editarDatos.css";
import api from "../api/axios";
import AlertMessage from "./AlertMessage";


function EditarDatos({ usuario, onClose, onSave, actualizarDatos }) {
  const [formData, setFormData] = useState(usuario);
  const [newCode, setNewCode] = useState(null);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [telefonoError, setTelefonoError] = useState("");

  const formatTelefono = (value) => {
    const digits = value.replace(/\D/g, "").slice(0, 11);
    if (digits.length <= 4) return digits;
    return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  };
  


  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "telefono") {
      const formattedTelefono = formatTelefono(value);
      setFormData({ ...formData, telefono: formattedTelefono });

      if (formattedTelefono === "" || /^04\d{2}-\d{7}$/.test(formattedTelefono)) {
        setTelefonoError("");
      } else {
        setTelefonoError("El teléfono debe tener 11 dígitos numéricos y comenzar con 04.");
      }
      return;
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

  const telefono = (formData.telefono || "").trim();
  if (!/^04\d{2}-\d{7}$/.test(telefono)) {
    setTelefonoError("El teléfono debe tener 11 dígitos numéricos y comenzar con 04.");
    return;
  }

  api.put(`/usuario/${usuario.id_usuario}`, {
    nombre: formData.nombre,
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

  const editDialog = createPortal(
    <div className="modal-edicion-overlay">
      <div className="modal-edicion">
        {newCode?.message && (
          <AlertMessage
            message={newCode.message}
            type={newCode.message === 'Nuevo código generado' ? "success" : "error"}
            onClose={() => {}}
          />
        )}
        <form onSubmit={handleSubmit}>
          <h3>Editar Usuario</h3>
          <label>Nombre: <input name="nombre" value={formData.nombre || ""} onChange={handleChange} /></label>
          <label>Dirección: <input name="direccion" value={formData.direccion || ""} onChange={handleChange} /></label>
          <label>Teléfono: <input name="telefono" value={formData.telefono || ""} onChange={handleChange} inputMode="numeric" maxLength={12} /></label>
          {telefonoError && (
            <AlertMessage
              message={telefonoError}
              type="error"
              onClose={() => setTelefonoError("")}
            />
          )}

          <button type="submit">Guardar</button>
          <button type="button" onClick={onClose}>Cancelar</button>
        </form>
      </div>
    </div>,
    document.body
  );
  return (
    <>
      {editDialog}
      {/* {codeDialog} */}
    </>
  );
}

export default EditarDatos;
