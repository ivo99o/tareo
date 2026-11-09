import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { supabase } from '../lib/supabase'
import { convertirFilaATarea, convertirTareaAFila } from '../utils/tareas'

function mostrarError(titulo) {
  Swal.fire({
    icon: 'error',
    title: titulo,
    text: 'Revisá tu conexión e intentá de nuevo.',
  })
}

function useTareas() {
  const [tareas, setTareas] = useState([])
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true

    async function cargarTareas() {
      const { data, error } = await supabase.from('tareas').select('*').order('fecha_objetivo')

      if (!activo) {
        return
      }

      if (error) {
        mostrarError('No se pudieron cargar las tareas')
      } else {
        setTareas(data.map(convertirFilaATarea))
      }

      setCargando(false)
    }

    cargarTareas()

    return () => {
      activo = false
    }
  }, [])

  async function guardarTarea(datosTarea, idEditado) {
    const fila = convertirTareaAFila(datosTarea)

    if (idEditado === null) {
      const { data, error } = await supabase.from('tareas').insert(fila).select().single()

      if (error) {
        mostrarError('No se pudo crear la tarea')
        return false
      }

      setTareas((actuales) => [...actuales, convertirFilaATarea(data)])
      return true
    }

    const { data, error } = await supabase
      .from('tareas')
      .update(fila)
      .eq('id', idEditado)
      .select()
      .single()

    if (error) {
      mostrarError('No se pudo guardar la tarea')
      return false
    }

    setTareas((actuales) =>
      actuales.map((tarea) => (tarea.id === idEditado ? convertirFilaATarea(data) : tarea)),
    )
    return true
  }

  async function eliminarTarea(id) {
    const { error } = await supabase.from('tareas').delete().eq('id', id)

    if (error) {
      mostrarError('No se pudo eliminar la tarea')
      return false
    }

    setTareas((actuales) => actuales.filter((tarea) => tarea.id !== id))
    return true
  }

  return { tareas, cargando, guardarTarea, eliminarTarea }
}

export default useTareas
