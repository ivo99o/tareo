import { useState } from 'react'
import { Alert, Button, Form, Modal } from 'react-bootstrap'

const NUMERO_SANDBOX = import.meta.env.VITE_TWILIO_SANDBOX_NUMBER
const CODIGO_SANDBOX = import.meta.env.VITE_TWILIO_SANDBOX_CODIGO
const DIGITOS_MINIMOS = 8

function ModalTelefono({ abierto, telefonoActual, onGuardar, onCerrar }) {
  const [telefono, setTelefono] = useState(telefonoActual ?? '')
  const [error, setError] = useState('')
  const [guardando, setGuardando] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    const digitos = telefono.replace(/\D/g, '')

    if (digitos.length < DIGITOS_MINIMOS) {
      setError('Ingresá un número de teléfono válido.')
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
    <Modal show={abierto} onHide={onCerrar} centered>
      <Form onSubmit={manejarEnvio}>
        <Modal.Header closeButton>
          <Modal.Title as="h2" className="h5">
            Avisos por WhatsApp
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            Cargá tu número y te avisamos por WhatsApp cuando una tarea esté por vencer o ya haya vencido.
          </p>

          {error && <Alert variant="danger">{error}</Alert>}

          <Form.Group controlId="telefonoPerfil" className="mb-3">
            <Form.Label>Teléfono</Form.Label>
            <Form.Control
              type="tel"
              value={telefono}
              onChange={(evento) => setTelefono(evento.target.value)}
              placeholder="Ej: 3815551234"
              autoComplete="tel"
              required
            />
          </Form.Group>

          <Alert variant="info" className="mb-0 small">
            Para recibir los mensajes tenés que unirte al sandbox de Twilio una sola vez: desde tu WhatsApp, enviá{' '}
            <strong>{CODIGO_SANDBOX}</strong> al número <strong>{NUMERO_SANDBOX}</strong>. Es un requisito de Twilio
            para su modo de prueba.
          </Alert>
        </Modal.Body>

        <Modal.Footer>
          <Button variant="outline-secondary" onClick={onCerrar}>
            Ahora no
          </Button>
          <Button type="submit" variant="primary" disabled={guardando}>
            {guardando ? 'Guardando...' : 'Guardar'}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

export default ModalTelefono
