import React, { useEffect } from 'react';
import '../css/alert.css';

function AlertMessage({ message, type = "error", onClose }) {
  useEffect(() => {
    if (message) {
        console.log("Mostrando mensaje de alerta:", message);
      const timer = setTimeout(() => {
        onClose(); // se oculta automáticamente
      }, 5000); // 3 segundos
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) {console.log("No hay mensaje de alerta para mostrar"); return null};

  return (
    <div className={`alert-message ${type} show`}>
      {message}
    </div>
  );
}

export default AlertMessage;
