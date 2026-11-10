import Icono from './Icono'

function BotonSelector({ id, icono, texto, vacio, invalido, onAbrir, onQuitar }) {
  return (
    <div className="selector-fila">
      <button
        id={id}
        type="button"
        className={`selector-boton ${vacio ? 'vacio' : ''} ${invalido ? 'invalido' : ''}`}
        aria-haspopup="dialog"
        onClick={onAbrir}
      >
        <Icono nombre={icono} tam={16} />
        <span>{texto}</span>
      </button>

      {onQuitar && !vacio && (
        <button type="button" className="selector-limpiar" onClick={onQuitar} aria-label="Quitar hora">
          <Icono nombre="cerrar" tam={14} />
        </button>
      )}
    </div>
  )
}

export default BotonSelector
