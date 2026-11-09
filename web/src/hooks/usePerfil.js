import { useEffect, useState } from 'react'
import Swal from 'sweetalert2'
import { supabase } from '../lib/supabase'
import useAuth from './useAuth'

function usePerfil() {
  const { usuario } = useAuth()
  const [telefono, setTelefono] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    let activo = true

    async function cargarPerfil() {
      const { data, error } = await supabase
        .from('perfiles')
        .select('telefono')
        .eq('id', usuario.id)
        .maybeSingle()

      if (!activo) {
        return
      }

      if (error) {
        Swal.fire({
          icon: 'error',
          title: 'No se pudo cargar tu perfil',
          text: 'Revisá tu conexión e intentá de nuevo.',
        })
      } else {
        setTelefono(data?.telefono ?? null)
      }

      setCargando(false)
    }

    cargarPerfil()

    return () => {
      activo = false
    }
  }, [usuario.id])

  async function guardarTelefono(nuevoTelefono) {
    const { error } = await supabase
      .from('perfiles')
      .update({ telefono: nuevoTelefono })
      .eq('id', usuario.id)

    if (error) {
      Swal.fire({
        icon: 'error',
        title: 'No se pudo guardar el teléfono',
        text: 'Revisá tu conexión e intentá de nuevo.',
      })
      return false
    }

    setTelefono(nuevoTelefono)
    return true
  }

  return { telefono, cargando, guardarTelefono }
}

export default usePerfil
