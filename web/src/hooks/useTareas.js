import { useEffect, useRef, useState } from 'react'
import { calcularSiguienteId, cargarTareas, guardarTareas } from '../utils/tareas'

function useTareas() {
  const [tareas, setTareas] = useState(() => cargarTareas())
  const siguienteId = useRef(calcularSiguienteId(tareas))

  useEffect(() => {
    guardarTareas(tareas)
  }, [tareas])

  function guardarTarea(datosTarea, idEditado) {
    if (idEditado === null) {
      setTareas((actuales) => [...actuales, { id: siguienteId.current++, ...datosTarea }])
    } else {
      setTareas((actuales) =>
        actuales.map((tarea) => (tarea.id === idEditado ? { ...tarea, ...datosTarea } : tarea)),
      )
    }
  }

  function eliminarTarea(id) {
    setTareas((actuales) => actuales.filter((tarea) => tarea.id !== id))
  }

  return { tareas, guardarTarea, eliminarTarea }
}

export default useTareas
