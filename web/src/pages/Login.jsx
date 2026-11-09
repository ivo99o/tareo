import { useState } from 'react'
import { Alert, Button, Card, Container, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'
import useAuth from '../hooks/useAuth'
import { obtenerMensajeDeErrorAuth } from '../utils/auth'

function Login() {
  const { iniciarSesion } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [enviando, setEnviando] = useState(false)

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setError('')
    setEnviando(true)

    try {
      await iniciarSesion(email, password)
    } catch (fallo) {
      setError(obtenerMensajeDeErrorAuth(fallo))
      setEnviando(false)
    }
  }

  return (
    <Container fluid className="bg-body-secondary min-vh-100 d-flex align-items-center justify-content-center p-3">
      <Seo
        titulo="Iniciar sesión | Tareo"
        descripcion="Iniciá sesión para ver y organizar tus tareas por categoría y fecha."
      />

      <Card className="w-100 shadow" style={{ maxWidth: '26rem' }}>
        <Card.Body className="p-4">
          <h1 className="h3 text-center mb-4">Iniciar sesión</h1>

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

            <Form.Group className="mb-4" controlId="password">
              <Form.Label>Contraseña</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(evento) => setPassword(evento.target.value)}
                autoComplete="current-password"
                required
              />
            </Form.Group>

            <Button type="submit" variant="primary" className="w-100" disabled={enviando}>
              {enviando ? 'Ingresando...' : 'Ingresar'}
            </Button>
          </Form>

          <p className="text-center mt-4 mb-0">
            ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
          </p>
        </Card.Body>
      </Card>
    </Container>
  )
}

export default Login
