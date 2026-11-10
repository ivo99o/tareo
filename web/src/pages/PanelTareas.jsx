import { useState } from 'react'
import AvisosWhatsApp from '../components/AvisosWhatsApp'
import ModalTelefono from '../components/ModalTelefono'
import PantallaCarga from '../components/PantallaCarga'
import useAvisosWhatsApp from '../hooks/useAvisosWhatsApp'
import usePerfil from '../hooks/usePerfil'
import useTareas from '../hooks/useTareas'
import Inicio from './Inicio'

function PanelTareas() {
  const { tareas, cargando: cargandoTareas, guardarTarea, eliminarTarea } = useTareas()
  const { telefono, cargando: cargandoPerfil, guardarTelefono } = usePerfil()
  const { avisos, cerrarAviso } = useAvisosWhatsApp(tareas, Boolean(telefono))
  const [modalAbierto, setModalAbierto] = useState(null)

  if (cargandoTareas || cargandoPerfil) {
    return <PantallaCarga />
  }

  const mostrarModal = modalAbierto ?? !telefono

  return (
    <>
      <Inicio
        tareas={tareas}
        telefono={telefono}
        onGuardar={guardarTarea}
        onEliminar={eliminarTarea}
        onAbrirTelefono={() => setModalAbierto(true)}
      />

      <AvisosWhatsApp avisos={avisos} onCerrar={cerrarAviso} />

      <ModalTelefono
        abierto={mostrarModal}
        telefonoActual={telefono}
        onGuardar={guardarTelefono}
        onCerrar={() => setModalAbierto(false)}
      />
    </>
  )
}

export default PanelTareas
