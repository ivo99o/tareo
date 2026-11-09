import AvisosWhatsApp from '../components/AvisosWhatsApp'
import PantallaCarga from '../components/PantallaCarga'
import useAvisosWhatsApp from '../hooks/useAvisosWhatsApp'
import useTareas from '../hooks/useTareas'
import Inicio from './Inicio'

function PanelTareas() {
  const { tareas, cargando, guardarTarea, eliminarTarea } = useTareas()
  const { avisos, cerrarAviso } = useAvisosWhatsApp(tareas)

  if (cargando) {
    return <PantallaCarga />
  }

  return (
    <>
      <Inicio tareas={tareas} onGuardar={guardarTarea} onEliminar={eliminarTarea} />

      <AvisosWhatsApp avisos={avisos} onCerrar={cerrarAviso} />
    </>
  )
}

export default PanelTareas
