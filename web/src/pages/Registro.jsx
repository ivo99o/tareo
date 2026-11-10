import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BotonGoogle from '../components/BotonGoogle'
import MensajeAuth from '../components/MensajeAuth'
import Seo from '../components/Seo'
import TarjetaAuth from '../components/TarjetaAuth'
import useAuth from '../hooks/useAuth'
import { describirErrorAuth } from '../utils/auth'
import { validarEmail, validarPassword, validarRepeticion } from '../utils/validaciones'

const LARGO_MINIMO_PASSWORD = 6

function Registro() {
  const { registrarse } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repetirPassword, setRepetirPassword] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [enviando, setEnviando] = useState(false)
  const [correoEnviado, setCorreoEnviado] = useState(false)

  function limpiarError(campo) {
    setErrores((actuales) => ({ ...actuales, [campo]: '' }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral(null)

    const nuevosErrores = {
      email: validarEmail(email),
      password: validarPassword(password, LARGO_MINIMO_PASSWORD),
      repetirPassword: validarRepeticion(password, repetirPassword),
    }

    if (nuevosErrores.email || nuevosErrores.password || nuevosErrores.repetirPassword) {
      setErrores(nuevosErrores)
      return
    }

    setErrores({})
    setEnviando(true)

    try {
      await registrarse(email.trim(), password)
      setCorreoEnviado(true)
    } catch (fallo) {
      setErrorGeneral(describirErrorAuth(fallo))
    } finally {
      setEnviando(false)
    }
  }

  return (
    <TarjetaAuth titulo="Creá tu cuenta" subtitulo="Registrate para empezar a organizar tus tareas.">
      <Seo
        titulo="Crear cuenta | tareo"
        descripcion="Creá tu cuenta para organizar tus tareas por categoría y fecha."
      />

      {correoEnviado ? (
        <>
          <MensajeAuth tipo="success">
            Te enviamos un correo a <strong>{email.trim()}</strong>. Confirmalo para poder iniciar sesión.
          </MensajeAuth>
          <Link to="/login" className="btn btn-tareo w-100 py-2">
            Ir a iniciar sesión
          </Link>
        </>
      ) : (
        <>
          {errorGeneral && <MensajeAuth tipo={errorGeneral.tipo}>{errorGeneral.texto}</MensajeAuth>}

          <Form noValidate onSubmit={manejarEnvio}>
            <Form.Group className="mb-3" controlId="email">
              <Form.Label className="small fw-semibold">Correo electrónico</Form.Label>
              <Form.Control
                type="email"
                className="py-2"
                value={email}
                onChange={(evento) => {
                  setEmail(evento.target.value)
                  limpiarError('email')
                }}
                isInvalid={Boolean(errores.email)}
                autoComplete="email"
              />
              <Form.Control.Feedback type="invalid">{errores.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="password">
              <Form.Label className="small fw-semibold">Contraseña</Form.Label>
              <Form.Control
                type="password"
                className="py-2"
                value={password}
                onChange={(evento) => {
                  setPassword(evento.target.value)
                  limpiarError('password')
                }}
                isInvalid={Boolean(errores.password)}
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-4" controlId="repetirPassword">
              <Form.Label className="small fw-semibold">Repetir contraseña</Form.Label>
              <Form.Control
                type="password"
                className="py-2"
                value={repetirPassword}
                onChange={(evento) => {
                  setRepetirPassword(evento.target.value)
                  limpiarError('repetirPassword')
                }}
                isInvalid={Boolean(errores.repetirPassword)}
                autoComplete="new-password"
              />
              <Form.Control.Feedback type="invalid">{errores.repetirPassword}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" variant="tareo" className="w-100 py-2" disabled={enviando}>
              {enviando ? 'Creando cuenta...' : 'Crear cuenta'}
            </Button>
          </Form>

          <div className="d-flex align-items-center gap-3 my-3 text-body-secondary small">
            <hr className="flex-grow-1 m-0" />
            o
            <hr className="flex-grow-1 m-0" />
          </div>

          <BotonGoogle onError={setErrorGeneral} />

          <p className="text-center mt-4 mb-0">
            ¿Ya tenés cuenta? <Link to="/login">Iniciá sesión</Link>
          </p>
        </>
      )}
    </TarjetaAuth>
  )
}

export default Registro
