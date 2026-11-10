import Icono from './Icono'

function BotonEliminar({ onClick }) {
  return (
    <button type="button" className="boton-icono boton-icono-eliminar" onClick={onClick} aria-label="Eliminar tarea" title="Eliminar">
      <Icono nombre="basura" tam={16} />
    </button>
  )
}

export default BotonEliminar
