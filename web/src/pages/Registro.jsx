import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import useAuth from '../hooks/useAuth'
import { obtenerMensajeDeErrorAuth } from '../utils/auth'

const LARGO_MINIMO_PASSWORD = 6

function Registro() {
  const { registrarse } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)
  const [correoEnviado, setCorreoEnviado] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')

    if (password.length < LARGO_MINIMO_PASSWORD) {
      setError(`La contraseña debe tener al menos ${LARGO_MINIMO_PASSWORD} caracteres.`)
      return
    }

    if (password !== repetirPassword) {
      setError('Las contraseñas no coinciden.')
      return
    }

    setEnviando(true)

    try {
      await registrarse(email, password)
      setCorreoEnviado(true)
    } catch (fallo) {
      setError(obtenerMensajeDeErrorAuth(fallo))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <Container fluid className="bg-body-secondary min-vh-100 d-flex align-items-center justify-content-center p-3">
      <Seo
        titulo="Crear cuenta | Tareo"
        descripcion="Creá tu cuenta para organizar tus tareas por categoría y fecha."
      />

      <Card className="w-100 shadow" style={{ maxWidth: '26rem' }}>
        <Card.Body className="p-4">
          <h1 className="h3 text-center mb-4">Crear cuenta</h1>

          {correoEnviado ? (
            <>
              <Alert variant="success">
                Te enviamos un correo a <strong>{email}</strong>. Confirmalo para poder iniciar sesión.
              </Alert>
              <Link to="/login" className="btn btn-primary w-100">
                Ir a iniciar sesión
              </Link>
            </>
          ) : (
            <>
              {error && <Alert variant="danger">{error}</Alert>}

              <Form onSubmit={manejarEnvio}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Correo electrónico</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(evento) => setEmail(evento.target.value)}
                    autoComplete="email"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3" controlId="password">
                  <Form.Label>Contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(evento) => setPassword(evento.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-4" controlId="repetirPassword">
                  <Form.Label>Repetir contraseña</Form.Label>
                  <Form.Control
                    type="password"
                    value={repetirPassword}
                    onChange={(evento) => setRepetirPassword(evento.target.value)}
                    autoComplete="new-password"
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100" disabled={enviando}>
                  {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
                </Button>
              </Form>

              <p className="text-center mt-4 mb-0">
                ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
              </p>
            </>
          )}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Registro
