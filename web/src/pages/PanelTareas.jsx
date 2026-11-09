import AvisosWhatsApp from '../components/AvisosWhatsApp'
import useAvisosWhatsApp from '../hooks/useAvisosWhatsApp'
import useTareas from '../hooks/useTareas'
import Inicio from './Inicio'

function PanelTareas() {
  const { tareas, guardarTarea, eliminarTarea } = useTareas()
  const { avisos, cerrarAviso } = useAvisosWhatsApp(tareas)

  return (
    <>
      <Inicio tareas={tareas} onGuardar={guardarTarea} onEliminar={eliminarTarea} />

      <AvisosWhatsApp avisos={avisos} onCerrar={cerrarAviso} />
    </>
  )
}

export default PanelTareas
