import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL

export async function enviarAvisoWhatsApp(tarea, estado) {
  const respuesta = await axios.post(API_URL, {
    telefono: tarea.telefono,
    titulo: tarea.titulo,
    estado: estado.texto,
  })

  return respuesta.data
}

export function obtenerMensajeDeError(error) {
  return error.response?.data?.error ?? 'No se pudo conectar con el servidor.'
}
