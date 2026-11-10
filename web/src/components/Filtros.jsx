import { NOMBRES_CATEGORIA } from '../utils/tareas'
import Icono from './Icono'

const ICONOS_CATEGORIA = {
  todos: 'lista',
  laboral: 'maletin',
  estudio: 'birrete',
  recordatorio: 'campana',
}

function Filtros({ filtroCategoriaActivo, soloPendientes, conteos, onCambiarCategoria, onAlternarPendientes }) {
  const categorias = [['todos', 'Todos'], ...Object.entries(NOMBRES_CATEGORIA)]

  return (
    <div className="barra-filtros" role="group" aria-label="Filtrar tareas por categoría y estado">
      <div className="filtros-categorias">
        {categorias.map(([valor, nombre]) => {
          const activo = filtroCategoriaActivo === valor

          return (
            <button
              key={valor}
              type="button"
              className={`filtro ${activo ? 'activo' : ''}`}
              aria-pressed={activo}
              onClick={() => onCambiarCategoria(valor)}
            >
              <Icono nombre={ICONOS_CATEGORIA[valor]} tam={16} />
              <span>{nombre}</span>
              <span className="filtro-conteo">{conteos[valor] ?? 0}</span>
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className={`interruptor ${soloPendientes ? 'activo' : ''}`}
        role="switch"
        aria-checked={soloPendientes}
        onClick={onAlternarPendientes}
      >
        <span className="interruptor-pista" aria-hidden="true">
          <span className="interruptor-perilla" />
        </span>
        <span>Solo pendientes</span>
      </button>
    </div>
  )
}

export default Filtros
