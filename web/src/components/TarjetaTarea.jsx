import Swal from 'sweetalert2'
import { NOMBRES_CATEGORIA, calcularEstado, describirTiempo, formatearDiaCorto, formatearHora } from '../utils/tareas'
import BotonEditar from './BotonEditar'
import BotonEliminar from './BotonEliminar'
import Icono from './Icono'

const ICONOS_CATEGORIA = {
  laboral: 'maletin',
  estudio: 'birrete',
  recordatorio: 'campana',
}

function TarjetaTarea({ tarea, onEditar, onEliminar }) {
  const estado = calcularEstado(tarea.fechaObjetivo)

  async function manejarEliminar() {
    const { isConfirmed } = await Swal.fire({
      icon: 'warning',
      title: '¿Eliminar esta tarea?',
      text: tarea.titulo,
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      focusCancel: true,
    })

    if (isConfirmed) {
      onEliminar(tarea.id)
    }
  }

  return (
    <article className="tarjeta-tarea" style={{ '--color-estado': estado.color, '--fondo-estado': estado.fondo }}>
      <div className="tarjeta-tarea-cabecera">
        <span className="etiqueta-categoria">
          <Icono nombre={ICONOS_CATEGORIA[tarea.categoria] ?? 'lista'} tam={14} />
          {NOMBRES_CATEGORIA[tarea.categoria] || tarea.categoria}
        </span>
        <span className="insignia-estado">
          <span className="punto-estado" aria-hidden="true" />
          {estado.etiqueta}
        </span>
      </div>

      <h2 className="tarjeta-tarea-titulo">{tarea.titulo}</h2>

      <div className="tarjeta-tarea-pie">
        <div className="tarjeta-tarea-fecha">
          <Icono nombre="calendario" tam={15} />
          <span>
            {formatearDiaCorto(tarea.fechaObjetivo)} · {formatearHora(tarea.fechaObjetivo)}
            <small>{describirTiempo(tarea.fechaObjetivo)}</small>
          </span>
        </div>

        <div className="tarjeta-tarea-acciones">
          <BotonEditar onClick={() => onEditar(tarea.id)} />
          <BotonEliminar onClick={manejarEliminar} />
        </div>
      </div>
    </article>
  )
}

export default TarjetaTarea
