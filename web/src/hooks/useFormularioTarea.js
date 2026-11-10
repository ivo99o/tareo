import { useEffect, useState } from 'react'
import { formatearFechaParaInput } from '../utils/tareas'

const ERROR_TITULO = 'Escribí un título para la tarea'
const ERROR_CATEGORIA = 'Elegí una categoría'
const ERROR_FECHA = 'Elegí una fecha objetivo'

function useFormularioTarea(tareaEnEdicion, onGuardar) {
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [errores, setErrores] = useState({})
  const [guardando, setGuardando] = useState(false)

  function limpiar() {
    setTitulo('')
    setCategoria('')
    setFecha('')
    setHora('')
    setErrores({})
  }

  useEffect(() => {
    if (tareaEnEdicion) {
      setErrores({})
      setTitulo(tareaEnEdicion.titulo)
      setCategoria(tareaEnEdicion.categoria)
      setFecha(formatearFechaParaInput(tareaEnEdicion.fechaObjetivo))
      setHora(tareaEnEdicion.fechaObjetivo.toTimeString().slice(0, 5))
    } else {
      limpiar()
    }
  }, [tareaEnEdicion])

  function limpiarError(campo) {
    setErrores((actuales) => ({ ...actuales, [campo]: '' }))
  }

  function cambiarTitulo(valor) {
    setTitulo(valor)
    limpiarError('titulo')
  }

  function cambiarCategoria(valor) {
    setCategoria(valor)
    limpiarError('categoria')
  }

  function cambiarFecha(valor) {
    setFecha(valor)
    limpiarError('fecha')
  }

  function validarDatos() {
    const nuevos = {
      titulo: titulo.trim() ? '' : ERROR_TITULO,
      categoria: categoria ? '' : ERROR_CATEGORIA,
    }

    setErrores((actuales) => ({ ...actuales, ...nuevos }))
    return !Object.values(nuevos).some(Boolean)
  }

  async function enviar() {
    const nuevos = {
      titulo: titulo.trim() ? '' : ERROR_TITULO,
      categoria: categoria ? '' : ERROR_CATEGORIA,
      fecha: fecha ? '' : ERROR_FECHA,
    }

    setErrores(nuevos)

    const campoConError = ['titulo', 'categoria', 'fecha'].find((campo) => nuevos[campo])

    if (campoConError) {
      return { ok: false, campoConError }
    }

    setGuardando(true)
    const guardada = await onGuardar({
      titulo: titulo.trim(),
      categoria,
      fechaObjetivo: new Date(`${fecha}T${hora || '23:59'}`),
    })
    setGuardando(false)

    if (guardada && !tareaEnEdicion) {
      limpiar()
    }

    return { ok: Boolean(guardada) }
  }

  return {
    titulo,
    categoria,
    fecha,
    hora,
    errores,
    guardando,
    cambiarTitulo,
    cambiarCategoria,
    cambiarFecha,
    cambiarHora: setHora,
    validarDatos,
    enviar,
  }
}

export default useFormularioTarea
