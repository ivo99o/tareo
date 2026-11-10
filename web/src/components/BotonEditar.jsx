import Icono from './Icono'

function BotonEditar({ onClick }) {
  return (
    <button type="button" className="boton-icono boton-icono-editar" onClick={onClick} aria-label="Editar tarea" title="Editar">
      <Icono nombre="lapiz" tam={16} />
    </button>
  )
}

export default BotonEditar
