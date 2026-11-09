import { Card } from 'react-bootstrap'
import { NOMBRES_CATEGORIA, calcularEstado } from '../utils/tareas'
import BotonEditar from './BotonEditar'
import BotonEliminar from './BotonEliminar'

function TarjetaTarea({ tarea, onEditar, onEliminar }) {
  const estado = calcularEstado(tarea.fechaObjetivo)

  const fechaLegible = tarea.fechaObjetivo.toLocaleString('es-AR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  function manejarEliminar() {
    const confirmado = confirm('¿Seguro que querés eliminar esta tarea?')
    if (!confirmado) return

    onEliminar(tarea.id)
  }

  return (
    <Card
      as="article"
      className={`h-100 bg-white border-0 border-start border-5 shadow ${estado.clase}`}
      style={estado.estilo}
    >
      <Card.Body className="text-center d-flex flex-column">
        <Card.Title as="h2" className="h5 mb-2 text-break">
          {tarea.titulo}
        </Card.Title>
        <div className="text-start">
          <Card.Text className="small mb-1">
            🏷️ Categoría: <strong>{NOMBRES_CATEGORIA[tarea.categoria] || tarea.categoria}</strong>
          </Card.Text>
          <Card.Text className="small mb-1">📅 Fecha objetivo: {fechaLegible}</Card.Text>
          <Card.Text className="small mb-0">
            {estado.icono} Estado: <strong>{estado.texto}</strong>
          </Card.Text>
        </div>
        <div className="d-flex justify-content-center gap-2 mt-auto pt-3">
          <BotonEliminar onClick={manejarEliminar} />
          <BotonEditar onClick={() => onEditar(tarea.id)} />
        </div>
      </Card.Body>
    </Card>
  )
}

export default TarjetaTarea
