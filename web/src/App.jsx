import AppRoutes from './routes/AppRoutes'
import useTareas from './hooks/useTareas'
import useAvisosWhatsApp from './hooks/useAvisosWhatsApp'
import AvisosWhatsApp from './components/AvisosWhatsApp'

function App() {
  const { tareas, guardarTarea, eliminarTarea } = useTareas()
  const { avisos, cerrarAviso } = useAvisosWhatsApp(tareas)

  return (
    <>
      <AppRoutes tareas={tareas} onGuardar={guardarTarea} onEliminar={eliminarTarea} />

      <AvisosWhatsApp avisos={avisos} onCerrar={cerrarAviso} />
    </>
  )
}

export default App
