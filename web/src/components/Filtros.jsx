import { Button } from 'react-bootstrap'
import { NOMBRES_CATEGORIA } from '../utils/tareas'

function Filtros({ filtroCategoriaActivo, soloPendientes, onCambiarCategoria, onAlternarPendientes }) {
  return (
    <div className="d-grid gap-2 d-lg-flex flex-lg-wrap justify-content-lg-center mb-4" role="group" aria-label="Filtrar tareas por categoría y estado">
      <Button
        variant={filtroCategoriaActivo === 'todos' ? 'dark' : 'outline-dark'}
        onClick={() => onCambiarCategoria('todos')}
      >
        Todos
      </Button>

      {Object.entries(NOMBRES_CATEGORIA).map(([valor, nombre]) => (
        <Button
          key={valor}
          variant={filtroCategoriaActivo === valor ? 'dark' : 'outline-dark'}
          onClick={() => onCambiarCategoria(valor)}
        >
          {nombre}
        </Button>
      ))}

      <Button
        variant={soloPendientes ? 'dark' : 'outline-dark'}
        aria-pressed={soloPendientes}
        onClick={onAlternarPendientes}
      >
        Pendiente
      </Button>
    </div>
  )
}

export default Filtros
