import { Col, Row } from 'react-bootstrap'
import TarjetaTarea from './TarjetaTarea'

function ListaTareas({ tareas, onEditar, onEliminar }) {
  if (tareas.length === 0) {
    return (
      <p className="text-center text-muted mb-0">No hay tareas que coincidan con estos filtros.</p>
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
