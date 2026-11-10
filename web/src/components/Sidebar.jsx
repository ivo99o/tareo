import { useCallback } from 'react'
import useEsEscritorio from '../hooks/useEsEscritorio'
import useFormularioTarea from '../hooks/useFormularioTarea'
import AsistenteTarea from './AsistenteTarea'
import FormularioTarea from './FormularioTarea'
import Icono from './Icono'

const PASOS_CELULAR = ['datos', 'fecha', 'hora']

function Sidebar({ abierta, onAbrir, tareaEnEdicion, onGuardar, onCancelarEdicion }) {
  const esEscritorio = useEsEscritorio()
  const formulario = useFormularioTarea(tareaEnEdicion, onGuardar)
  const editando = Boolean(tareaEnEdicion)
  const cerrarAsistente = useCallback(() => onCancelarEdicion(), [onCancelarEdicion])

  if (esEscritorio) {
    return (
      <div className="sidebar-tareo">
        <div className="contenido-sidebar">
          <div className="text-center mb-4">
            <img src="/tareo-logo-claro.svg" alt="tareo" height="40" />
          </div>

          <div className="titulo-sidebar">
            <h2 className="h5 mb-0">{editando ? 'Editar tarea' : 'Nueva tarea'}</h2>
            <p className="mb-0">{editando ? 'Cambiá lo que necesites y guardá.' : 'Completá los datos y listo.'}</p>
          </div>

          <FormularioTarea formulario={formulario} editando={editando} onCancelar={onCancelarEdicion} />
        </div>
      </div>
    )
  }

  return (
    <>
      {!abierta && (
        <button type="button" className="boton-flotante" aria-label="Agregar tarea" onClick={onAbrir}>
          <Icono nombre="plus" tam={28} />
        </button>
      )}

      {abierta && (
        <AsistenteTarea pasos={PASOS_CELULAR} formulario={formulario} editando={editando} onCerrar={cerrarAsistente} />
      )}
    </>
  )
}

export default Sidebar
