import { Col, Row } from 'react-bootstrap'
import Icono from './Icono'
import TarjetaTarea from './TarjetaTarea'

function ListaTareas({ tareas, hayTareas, onEditar, onEliminar }) {
  if (tareas.length === 0) {
    return (
      <div className="estado-vacio">
        <span className="estado-vacio-icono">
          <Icono nombre="portapapeles" tam={28} />
        </span>
        <h2 className="h6 mb-1">{hayTareas ? 'No hay tareas con este filtro' : 'Todavía no tenés tareas'}</h2>
        <p className="mb-0">
          {hayTareas
            ? 'Probá con otra categoría o desactivá "Solo pendientes".'
            : 'Creá la primera con el formulario "Nueva tarea" (en el celular, con el botón +).'}
        </p>
      </div>
    )
  }

  return (
    <Row as="section" xs={1} md={2} xl={3} className="g-3" aria-label="Listado de tareas">
      {tareas.map((tarea) => (
        <Col key={tarea.id}>
          <TarjetaTarea tarea={tarea} onEditar={onEditar} onEliminar={onEliminar} />
        </Col>
      ))}
    </Row>
  )
}

export default ListaTareas
