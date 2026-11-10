import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'
import { validarTelefono } from '../utils/validaciones'
import Icono from './Icono'

const NUMERO_SANDBOX = import.meta.env.VITE_TWILIO_SANDBOX_NUMBER
const CODIGO_SANDBOX = import.meta.env.VITE_TWILIO_SANDBOX_CODIGO

function ModalTelefono({ abierto, telefonoActual, onGuardar, onCerrar }) {
  const [telefono, setTelefono] = useState(telefonoActual ?? '')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    const mensajeError = validarTelefono(telefono)

    if (mensajeError) {
      setError(mensajeError)
      return
    }

    setGuardando(true)
    const guardado = await onGuardar(telefono.trim())
    setGuardando(false)

    if (guardado) {
      onCerrar()
    }
  }

  return (
    <Modal show={abierto} onHide={onCerrar} centered contentClassName="modal-tareo">
      <Form noValidate onSubmit={manejarEnvio}>
        <Modal.Header closeButton>
          <span className="modal-tareo-icono">
            <Icono nombre="mensaje" tam={22} />
          </span>
          <Modal.Title as="h2" className="h5 mb-0">
            Avisos por WhatsApp
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p className="text-body-secondary">
            Cargá tu número y te avisamos por WhatsApp cuando una tarea esté por vencer o ya haya vencido.
          </p>

          <Form.Group controlId="telefonoPerfil" className="mb-3">
            <Form.Label className="fw-semibold small">Teléfono</Form.Label>
            <Form.Control
              type="tel"
              value={telefono}
              onChange={(evento) => {
                setTelefono(evento.target.value)
                setError('')
              }}
              isInvalid={Boolean(error)}
              placeholder="Ej: 3815551234"
              autoComplete="tel"
            />
            <Form.Control.Feedback type="invalid">{error}</Form.Control.Feedback>
          </Form.Group>

          <Alert variant="warning" className="alerta-sandbox">
            Para recibir los mensajes tenés que unirte al sandbox de Twilio una sola vez: desde tu WhatsApp, enviá{' '}
            <strong>{CODIGO_SANDBOX}</strong> al número <strong>{NUMERO_SANDBOX}</strong>. Es un requisito de Twilio
            para su modo de prueba.
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCerrar}>
            Ahora no
          </Button>
          <Button type="submit" variant="tareo" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ModalTelefono
