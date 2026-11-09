import { useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { NOMBRES_CATEGORIA, formatearFechaParaInput } from '../utils/tareas'

function FormularioTarea({ tareaEnEdicion, onGuardar }) {
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [telefono, setTelefono] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')

  useEffect(() => {
    if (tareaEnEdicion) {
      setTitulo(tareaEnEdicion.titulo)
      setCategoria(tareaEnEdicion.categoria)
      setTelefono(tareaEnEdicion.telefono)
      setFecha(formatearFechaParaInput(tareaEnEdicion.fechaObjetivo))
      setHora(tareaEnEdicion.fechaObjetivo.toTimeString().slice(0, 5))
    } else {
      setTitulo('')
      setCategoria('')
      setTelefono('')
      setFecha('')
      setHora('')
    }
  }, [tareaEnEdicion])

  function manejarEnvio(evento) {
    evento.preventDefault()

    const fechaObjetivo = new Date(`${fecha}T${hora || '23:59'}`)

    onGuardar({
      titulo: titulo.trim(),
      categoria,
      telefono: telefono.trim(),
      fechaObjetivo,
    })
  }

  return (
    <Form onSubmit={manejarEnvio}>
      <div className="campos d-flex flex-column gap-4">
        <Form.Group controlId="titulo" className="campo d-flex flex-column gap-1">
          <Form.Label className="small mb-0">Título</Form.Label>
          <Form.Control
            type="text"
            value={titulo}
            onChange={(evento) => setTitulo(evento.target.value)}
            placeholder="Título de la tarea"
            required
          />
        </Form.Group>

        <Form.Group controlId="categoria" className="campo d-flex flex-column gap-1">
          <Form.Label className="small mb-0">Categoría</Form.Label>
          <Form.Select
            value={categoria}
            onChange={(evento) => setCategoria(evento.target.value)}
            required
          >
            <option value="">Seleccionar categoría</option>
            {Object.entries(NOMBRES_CATEGORIA).map(([valor, nombre]) => (
              <option key={valor} value={valor}>{nombre}</option>
            ))}
          </Form.Select>
        </Form.Group>

        <Form.Group controlId="telefono" className="campo d-flex flex-column gap-1">
          <Form.Label className="small mb-0">Teléfono</Form.Label>
          <Form.Control
            type="tel"
            value={telefono}
            onChange={(evento) => setTelefono(evento.target.value)}
            placeholder="Ej: 3815551234"
            required
          />
        </Form.Group>

        <Form.Group controlId="fecha" className="campo d-flex flex-column gap-1">
          <Form.Label className="small mb-0">Fecha objetivo</Form.Label>
          <Form.Control
            type="date"
            value={fecha}
            onChange={(evento) => setFecha(evento.target.value)}
            required
          />
        </Form.Group>

        <Form.Group controlId="hora" className="campo d-flex flex-column gap-1">
          <Form.Label className="small mb-0">Hora</Form.Label>
          <Form.Control
            type="time"
            value={hora}
            onChange={(evento) => setHora(evento.target.value)}
          />
        </Form.Group>
      </div>

      <Button type="submit" variant="primary" className="fw-bold w-100 mt-4">
        {tareaEnEdicion ? 'Guardar cambios' : 'Crear tarea'}
      </Button>
    </Form>
  )
}

export default FormularioTarea
