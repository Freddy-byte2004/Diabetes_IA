import { useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaCalculator } from 'react-icons/fa';
import '../css/pedigreeCalculator.css';

const BASE_VALUE = 0.1;
const MAX_VALUE = 2.5;

function sanitizeCount(value) {
  const parsedValue = Number.parseInt(value, 10);
  if (Number.isNaN(parsedValue) || parsedValue < 0) {
    return 0;
  }

  return parsedValue;
}

function PedigreeCalculator({ onCalculated }) {
  const [isOpen, setIsOpen] = useState(false);
  const [abueloPaterno, setAbueloPaterno] = useState(false);
  const [abuelaPaterna, setAbuelaPaterna] = useState(false);
  const [abueloMaterno, setAbueloMaterno] = useState(false);
  const [abuelaMaterna, setAbuelaMaterna] = useState(false);
  const [padre, setPadre] = useState(false);
  const [madre, setMadre] = useState(false);
  const [hermanosActivo, setHermanosActivo] = useState(false);
  const [cantidadHermanos, setCantidadHermanos] = useState('0');
  const [tiosActivo, setTiosActivo] = useState(false);
  const [cantidadTios, setCantidadTios] = useState('0');

  const resultado = useMemo(() => {
    const totalGrandparents = [abueloPaterno, abuelaPaterna, abueloMaterno, abuelaMaterna].filter(Boolean).length;
    const totalParents = [padre, madre].filter(Boolean).length;
    const hermanos = hermanosActivo ? sanitizeCount(cantidadHermanos) : 0;
    const tios = tiosActivo ? sanitizeCount(cantidadTios) : 0;

    const sum =
      BASE_VALUE +
      totalGrandparents * 0.25 +
      totalParents * 0.5 +
      hermanos * 0.5 +
      tios * 0.25;

    return parseFloat(Math.min(sum, MAX_VALUE).toFixed(2));
  }, [
    abueloPaterno,
    abuelaPaterna,
    abueloMaterno,
    abuelaMaterna,
    padre,
    madre,
    hermanosActivo,
    cantidadHermanos,
    tiosActivo,
    cantidadTios,
  ]);

  const alcanzoMaximo = resultado >= MAX_VALUE;

  const cargaGenetica = useMemo(() => {
    if (resultado < 0.3) {
      return {
        mensaje: 'Carga genetica baja',
        clase: 'pedigree-risk-low',
      };
    }

    if (resultado < 0.8) {
      return {
        mensaje: 'Carga genetica moderada',
        clase: 'pedigree-risk-moderate',
      };
    }

    return {
      mensaje: 'Carga genetica alta',
      clase: 'pedigree-risk-high',
    };
  }, [resultado]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }

  function applyValue() {
    onCalculated(resultado);
    closeModal();
  }

  return (
    <>
      <button
        type="button"
        className="pedigree-trigger"
        onClick={openModal}
        title="Calcular función de herencia"
        aria-label="Calcular función de herencia"
      >
        <FaCalculator aria-hidden="true" />
        <span className="pedigree-trigger-tooltip">Calcular función de herencia</span>
      </button>

      {isOpen && createPortal((
        <div className="pedigree-modal-overlay" onClick={closeModal}>
          <div
            className="pedigree-modal"
            onClick={(event) => event.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="pedigree-modal-title"
          >
            <div className="pedigree-modal-header">
              <div>
                <h2 id="pedigree-modal-title">Calculadora de Riesgo Hereditario</h2>
                <p>Suma de incidencia de diabetes en familiares de 1er y 2do grado.</p>
              </div>
              <button type="button" className="pedigree-modal-close" onClick={closeModal} aria-label="Cerrar calculadora">
                ×
              </button>
            </div>

            <div className="pedigree-grid">
              <section className="pedigree-section">
                <h3>Familiares de segundo grado</h3>
                <label className="pedigree-check-row">
                  <input type="checkbox" checked={abueloPaterno} onChange={(event) => setAbueloPaterno(event.target.checked)} />
                  Abuelo Paterno (+0.25)
                </label>
                <label className="pedigree-check-row">
                  <input type="checkbox" checked={abuelaPaterna} onChange={(event) => setAbuelaPaterna(event.target.checked)} />
                  Abuela Paterna (+0.25)
                </label>
                <label className="pedigree-check-row">
                  <input type="checkbox" checked={abueloMaterno} onChange={(event) => setAbueloMaterno(event.target.checked)} />
                  Abuelo Materno (+0.25)
                </label>
                <label className="pedigree-check-row">
                  <input type="checkbox" checked={abuelaMaterna} onChange={(event) => setAbuelaMaterna(event.target.checked)} />
                  Abuela Materna (+0.25)
                </label>
                <label className="pedigree-check-row pedigree-check-row-with-input">
                  <span className="pedigree-inline-check">
                    <input type="checkbox" checked={tiosActivo} onChange={(event) => setTiosActivo(event.target.checked)} />
                    Tíos (+0.25 c/u)
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={cantidadTios}
                    onChange={(event) => setCantidadTios(event.target.value)}
                    disabled={!tiosActivo}
                    aria-label="Cantidad de tíos con diabetes"
                  />
                </label>
              </section>

              <section className="pedigree-section">
                <h3>Familiares de primer grado</h3>
                <label className="pedigree-check-row">
                  <input type="checkbox" checked={padre} onChange={(event) => setPadre(event.target.checked)} />
                  Padre (+0.50)
                </label>
                <label className="pedigree-check-row">
                  <input type="checkbox" checked={madre} onChange={(event) => setMadre(event.target.checked)} />
                  Madre (+0.50)
                </label>
                <label className="pedigree-check-row pedigree-check-row-with-input">
                  <span className="pedigree-inline-check">
                    <input
                      type="checkbox"
                      checked={hermanosActivo}
                      onChange={(event) => setHermanosActivo(event.target.checked)}
                    />
                    Hermanos (+0.50 c/u)
                  </span>
                  <input
                    type="number"
                    min="0"
                    value={cantidadHermanos}
                    onChange={(event) => setCantidadHermanos(event.target.value)}
                    disabled={!hermanosActivo}
                    aria-label="Cantidad de hermanos con diabetes"
                  />
                </label>
              </section>
            </div>

            <div className="pedigree-result-box">
              <span>Valor calculado</span>
              <strong>{resultado.toFixed(2)}</strong>
            </div>

            <div className={`pedigree-risk-alert ${cargaGenetica.clase}`} role="status" aria-live="polite">
              {cargaGenetica.mensaje}
            </div>

            {alcanzoMaximo && (
              <div className="pedigree-max-alert" role="status" aria-live="polite">
                Este es el valor maximo que puede recibir el modelo.
              </div>
            )}

            <div className="pedigree-modal-actions">
              <button type="button" className="pedigree-secondary-button" onClick={closeModal}>
                Cancelar
              </button>
              <button type="button" className="pedigree-primary-button" onClick={applyValue}>
                Aplicar
              </button>
            </div>
          </div>
        </div>
      ), document.body)}
    </>
  );
}

export default PedigreeCalculator;