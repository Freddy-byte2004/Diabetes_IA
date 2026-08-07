import { useEffect, useMemo, useState } from 'react';

function formatCountdown(seconds) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, '0');
  const remainingSeconds = (seconds % 60).toString().padStart(2, '0');
  return `${minutes}:${remainingSeconds}`;
}

function VerificationModal({
  isOpen,
  usuario,
  title,
  subtitle,
  onVerify,
  onResend,
  onClose,
  verifyLabel = 'Verificar codigo',
  resendCooldownSeconds = 60,
  expirationMinutes = 15,
  loadingVerify = false,
  loadingResend = false,
  lockClose = false
}) {
  const [codigo, setCodigo] = useState('');
  const [feedback, setFeedback] = useState('');
  const [feedbackType, setFeedbackType] = useState('error');
  const [resendTimer, setResendTimer] = useState(resendCooldownSeconds);

  useEffect(() => {
    if (!isOpen) {
      return;
    }

    setCodigo('');
    setFeedback('');
    setFeedbackType('error');
    setResendTimer(resendCooldownSeconds);
  }, [isOpen, resendCooldownSeconds]);

  useEffect(() => {
    if (!isOpen || resendTimer <= 0) {
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen, resendTimer]);

  const resendText = useMemo(() => {
    if (resendTimer > 0) {
      return `Reenviar en ${formatCountdown(resendTimer)}`;
    }
    return 'Reenviar codigo';
  }, [resendTimer]);

  if (!isOpen) {
    return null;
  }

  const handleVerify = async () => {
    const codigoNormalizado = codigo.trim();
    if (!codigoNormalizado) {
      setFeedback('Debes ingresar el codigo de verificacion.');
      setFeedbackType('error');
      return;
    }

    try {
      const result = await onVerify(codigoNormalizado);
      if (result?.ok) {
        setFeedback(result.message || 'Cuenta verificada exitosamente.');
        setFeedbackType('success');
        return;
      }

      setFeedback(result?.message || 'No se pudo verificar la cuenta.');
      setFeedbackType('error');
    } catch (error) {
      setFeedback('No se pudo verificar la cuenta.');
      setFeedbackType('error');
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) {
      return;
    }

    try {
      const result = await onResend();
      if (result?.ok) {
        setFeedback(result.message || 'Se envio un nuevo codigo a tu correo.');
        setFeedbackType('success');
      } else {
        setFeedback(result?.message || 'No se pudo reenviar el codigo.');
        setFeedbackType('error');
      }
      setResendTimer(resendCooldownSeconds);
    } catch (error) {
      setFeedback('No se pudo reenviar el codigo.');
      setFeedbackType('error');
      setResendTimer(resendCooldownSeconds);
    }
  };

  return (
    <div className='dialogo-overlay-codigo'>
      <div className='dialogo-codigo dialogo-verificacion'>
        <h2>{title}</h2>
        <p>{subtitle}</p>
        <p className='texto-expiracion'>Este codigo expira en {expirationMinutes} minutos.</p>

        <label className='label-verificacion' htmlFor='codigo-verificacion'>
          Codigo de verificacion
        </label>
        <input
          id='codigo-verificacion'
          type='text'
          className='input-codigo-verificacion'
          placeholder='Ingresa el codigo enviado a tu correo'
          value={codigo}
          onChange={(event) => setCodigo(event.target.value)}
          autoComplete='one-time-code'
          disabled={loadingVerify || loadingResend}
        />

        {feedback && (
          <p className={feedbackType === 'success' ? 'mensaje-modal-exito' : 'mensaje-modal-error'}>
            {feedback}
          </p>
        )}

        <div className='acciones-modal-verificacion'>
          <button
            type='button'
            className='boton-codigo-dialogo boton-verificar-codigo'
            onClick={handleVerify}
            disabled={loadingVerify || loadingResend}
          >
            {loadingVerify ? 'Verificando...' : verifyLabel}
          </button>
          <button
            type='button'
            className='boton-codigo-dialogo boton-secundario-verificacion'
            onClick={onClose}
            disabled={lockClose || loadingVerify || loadingResend}
          >
            Cancelar
          </button>
        </div>

        <div className='bloque-reenvio-codigo'>
          <span>No recibiste tu codigo?</span>
          <button
            type='button'
            className='link-reenviar-codigo'
            onClick={handleResend}
            disabled={resendTimer > 0 || loadingResend || loadingVerify}
          >
            {loadingResend ? 'Reenviando...' : resendText}
          </button>
        </div>

        <p className='correo-verificacion'>Correo: {usuario}</p>
      </div>
    </div>
  );
}

export default VerificationModal;
