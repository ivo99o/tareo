import axios from 'axios'
import { supabase } from '../lib/supabase'

const API_URL = import.meta.env.VITE_API_URL || '/api/notificar'

export async function enviarAvisoWhatsApp(tarea) {
  const { data } = await supabase.auth.getSession()

  const respuesta = await axios.post(
    API_URL,
    { tareaId: tarea.id },
    { headers: { Authorization: `Bearer ${data.session.access_token}` } },
  )

  return respuesta.data
}

export function obtenerMensajeDeError(error) {
  return error.response?.data?.error ?? 'No se pudo conectar con el servidor.'
}
