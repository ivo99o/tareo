import { NOMBRES_CATEGORIA } from '../utils/tareas'
import Icono from './Icono'

const ICONOS_CATEGORIA = {
  laboral: 'maletin',
  estudio: 'birrete',
  recordatorio: 'campana',
}

function SelectorCategoria({ valor, error, onElegir }) {
  return (
    <div className="campo-tarea">
      <span className="etiqueta-campo" id="etiqueta-categoria">Categoría</span>
      <div className="grupo-categorias" role="radiogroup" aria-labelledby="etiqueta-categoria">
        {Object.entries(NOMBRES_CATEGORIA).map(([clave, nombre]) => (
          <button
            key={clave}
            type="button"
            role="radio"
            aria-checked={valor === clave}
            className={`opcion-categoria ${valor === clave ? 'activa' : ''}`}
            onClick={() => onElegir(clave)}
          >
            <Icono nombre={ICONOS_CATEGORIA[clave]} tam={20} />
            <span>{nombre}</span>
          </button>
        ))}
      </div>
      {error && <p className="error-campo">{error}</p>}
    </div>
  )
}

export default SelectorCategoria
