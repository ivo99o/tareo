export const NOMBRES_CATEGORIA = {
  laboral: 'Laboral',
  estudio: 'Estudio',
  recordatorio: 'Recordatorio',
}

export function convertirFilaATarea(fila) {
  return {
    id: fila.id,
    titulo: fila.titulo,
    categoria: fila.categoria,
    fechaObjetivo: new Date(fila.fecha_objetivo),
  }
}

export function convertirTareaAFila(tarea) {
  return {
    titulo: tarea.titulo,
    categoria: tarea.categoria,
    fecha_objetivo: tarea.fechaObjetivo.toISOString(),
  }
}

export function formatearFechaParaInput(fecha) {
  const anio = fecha.getFullYear()
  const mes = String(fecha.getMonth() + 1).padStart(2, '0')
  const dia = String(fecha.getDate()).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

export function calcularEstado(fechaObjetivo) {
  const horasRestantes = (fechaObjetivo.getTime() - Date.now()) / (60 * 60 * 1000)

  if (horasRestantes < 0) {
    return { clase: 'border-danger', clave: 'vencida', texto: 'VENCIDA', icono: '🔴' }
  }
  if (horasRestantes <= 12) {
    return {
      clase: '',
      estilo: { '--bs-border-color': 'var(--bs-orange)' },
      clave: 'naranja',
      texto: 'NARANJA',
      icono: '🟠',
    }
  }
  if (horasRestantes <= 24) {
    return { clase: 'border-warning', clave: 'amarilla', texto: 'AMARILLO', icono: '🟡' }
  }
  return { clase: 'border-dark', clave: 'pendiente', texto: 'PENDIENTE', icono: '⚫' }
}
