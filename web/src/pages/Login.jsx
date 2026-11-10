import { useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import BotonGoogle from '../components/BotonGoogle'
import MensajeAuth from '../components/MensajeAuth'
import Seo from '../components/Seo'
import TarjetaAuth from '../components/TarjetaAuth'
import useAuth from '../hooks/useAuth'
import { describirErrorAuth } from '../utils/auth'
import { validarEmail, validarPassword } from '../utils/validaciones'

function Login() {
  const { iniciarSesion } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [errores, setErrores] = useState({})
  const [errorGeneral, setErrorGeneral] = useState(null)
  const [enviando, setEnviando] = useState(false)

  function limpiarError(campo) {
    setErrores((actuales) => ({ ...actuales, [campo]: '' }))
  }

  async function manejarEnvio(evento) {
    evento.preventDefault()
    setErrorGeneral(null)

    const nuevosErrores = {
      email: validarEmail(email),
      password: validarPassword(password),
    }

    if (nuevosErrores.email || nuevosErrores.password) {
      setErrores(nuevosErrores)
      return
    }

    setErrores({})
    setEnviando(true)

    try {
      await iniciarSesion(email.trim(), password)
    } catch (fallo) {
      setErrorGeneral(describirErrorAuth(fallo))
      setEnviando(false)
    }
  }

  return (
    <TarjetaAuth titulo="Iniciá sesión" subtitulo="Entrá para ver y organizar tus tareas.">
      <Seo
        titulo="Iniciar sesión | tareo"
        descripcion="Iniciá sesión para ver y organizar tus tareas por categoría y fecha."
      />

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

        <Form.Group className="mb-4" controlId="password">
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
            autoComplete="current-password"
          />
          <Form.Control.Feedback type="invalid">{errores.password}</Form.Control.Feedback>
        </Form.Group>

        <Button type="submit" variant="tareo" className="w-100 py-2" disabled={enviando}>
          {enviando ? 'Ingresando...' : 'Ingresar'}
        </Button>
      </Form>

      <div className="d-flex align-items-center gap-3 my-3 text-body-secondary small">
        <hr className="flex-grow-1 m-0" />
        o
        <hr className="flex-grow-1 m-0" />
      </div>

      <BotonGoogle onError={setErrorGeneral} />

      <p className="text-center mt-4 mb-0">
        ¿No tenés cuenta? <Link to="/registro">Registrate</Link>
      </p>
    </TarjetaAuth>
  )
}

export default Login
