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
    return {
      clave: 'vencida',
      texto: 'VENCIDA',
      etiqueta: 'Vencida',
      frase: 'venció',
      color: '#dc2626',
      fondo: '#fee2e2',
    }
  }
  if (horasRestantes <= 12) {
    return {
      clave: 'naranja',
      texto: 'NARANJA',
      etiqueta: 'Menos de 12 h',
      frase: 'vence en menos de 12 horas',
      color: '#ea580c',
      fondo: '#ffedd5',
    }
  }
  if (horasRestantes <= 24) {
    return {
      clave: 'amarilla',
      texto: 'AMARILLO',
      etiqueta: 'Menos de 24 h',
      frase: 'vence en menos de 24 horas',
      color: '#ca8a04',
      fondo: '#fef9c3',
    }
  }
  return {
    clave: 'pendiente',
    texto: 'PENDIENTE',
    etiqueta: 'Pendiente',
    frase: 'está pendiente',
    color: '#1e293b',
    fondo: '#e2e8f0',
  }
}

export function describirTiempo(fechaObjetivo) {
  const minutos = Math.round((fechaObjetivo.getTime() - Date.now()) / 60000)
  const absoluto = Math.abs(minutos)

  let cantidad
  if (absoluto < 1) {
    return 'ahora'
  } else if (absoluto < 60) {
    cantidad = `${absoluto} min`
  } else if (absoluto < 48 * 60) {
    cantidad = `${Math.round(absoluto / 60)} h`
  } else {
    cantidad = `${Math.round(absoluto / (24 * 60))} días`
  }

  return minutos > 0 ? `en ${cantidad}` : `hace ${cantidad}`
}

export function formatearDiaCorto(fecha) {
  return fecha.toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short' })
}

export function formatearHora(fecha) {
  return fecha.toLocaleTimeString('es-AR', { hour: '2-digit', minute: '2-digit', hour12: false })
}

export function horaActual() {
  const ahora = new Date()

  return `${String(ahora.getHours()).padStart(2, '0')}:${String(ahora.getMinutes()).padStart(2, '0')}`
}
