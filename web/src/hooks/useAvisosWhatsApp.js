import { useEffect, useRef, useState } from 'react'
import Swal from 'sweetalert2'
import { calcularEstado } from '../utils/tareas'
import { enviarAvisoWhatsApp, obtenerMensajeDeError } from '../utils/whatsapp'

function useAvisosWhatsApp(tareas) {
  const [, forzarActualizacion] = useState(0)
  const [avisos, setAvisos] = useState([])
  const estadosAnteriores = useRef(new Map())
  const siguienteAviso = useRef(1)

  useEffect(() => {
    async function avisarPorWhatsApp(tarea, estado) {
      const id = siguienteAviso.current++

      setAvisos((actuales) => [
        ...actuales,
        { id, fase: 'enviando', titulo: tarea.titulo, telefono: tarea.telefono, estado: estado.texto },
      ])

      try {
        const respuesta = await enviarAvisoWhatsApp(tarea, estado)

        setAvisos((actuales) =>
          actuales.map((aviso) =>
            aviso.id === id
              ? { ...aviso, fase: 'enviado', destino: respuesta.destino, envio: respuesta.estado, hora: new Date() }
              : aviso,
          ),
        )
      } catch (error) {
        setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id))

        Swal.fire({
          icon: 'error',
          title: 'No se pudo enviar el aviso por WhatsApp',
          text: obtenerMensajeDeError(error),
        })
      }
    }

    function revisarCambiosDeEstado(notificarCambios) {
      tareas.forEach((tarea) => {
        const estado = calcularEstado(tarea.fechaObjetivo)
        const estadoAnterior = estadosAnteriores.current.get(tarea.id)

        if (estadoAnterior !== estado.texto) {
          if (notificarCambios && estadoAnterior !== undefined) {
            const esUrgente = estado.texto === 'AMARILLO' || estado.texto === 'NARANJA' || estado.texto === 'VENCIDA'
            if (esUrgente) {
              avisarPorWhatsApp(tarea, estado)
            }
          }
          estadosAnteriores.current.set(tarea.id, estado.texto)
        }
      })
    }

    revisarCambiosDeEstado(true)

    const intervalo = setInterval(() => {
      revisarCambiosDeEstado(true)
      forzarActualizacion((valor) => valor + 1)
    }, 10000)

    return () => clearInterval(intervalo)
  }, [tareas])

  function cerrarAviso(id) {
    setAvisos((actuales) => actuales.filter((aviso) => aviso.id !== id))
  }

  return { avisos, cerrarAviso }
}

export default useAvisosWhatsApp
