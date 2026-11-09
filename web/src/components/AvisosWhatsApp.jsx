import { Spinner, Toast, ToastContainer } from 'react-bootstrap'

function AvisosWhatsApp({ avisos, onCerrar }) {
  return (
    <ToastContainer position="bottom-end" className="position-fixed p-3">
      {avisos.map((aviso) => {
        const enviando = aviso.fase === 'enviando'

        return (
          <Toast key={aviso.id} show autohide={!enviando} delay={8000} onClose={() => onCerrar(aviso.id)}>
            <Toast.Header closeButton={!enviando}>
              {enviando && <Spinner animation="border" size="sm" className="me-2" aria-hidden="true" />}
              <strong className="me-auto">{enviando ? 'Enviando aviso...' : 'Notificación enviada'}</strong>
              {!enviando && <small>{aviso.hora.toLocaleTimeString('es-AR')}</small>}
            </Toast.Header>
            <Toast.Body>
              {enviando ? (
                <>
                  Mandando WhatsApp a {aviso.telefono} por la tarea <strong>{aviso.titulo}</strong>.
                </>
              ) : (
                <>
                  <strong>{aviso.titulo}</strong> pasó a {aviso.estado}. Aviso enviado a {aviso.destino} (Twilio:{' '}
                  {aviso.envio}).
                </>
              )}
            </Toast.Body>
          </Toast>
        )
      })}
    </ToastContainer>
  )
}

export default AvisosWhatsApp
