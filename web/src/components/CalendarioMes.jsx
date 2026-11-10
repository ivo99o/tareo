import { useState } from 'react'
import { formatearFechaParaInput } from '../utils/tareas'
import Icono from './Icono'

const DIAS_SEMANA = ['L', 'M', 'M', 'J', 'V', 'S', 'D']

function primerDiaDelMes(fecha) {
  return new Date(fecha.getFullYear(), fecha.getMonth(), 1)
}

function construirDias(mes) {
  const relleno = (mes.getDay() + 6) % 7
  const total = new Date(mes.getFullYear(), mes.getMonth() + 1, 0).getDate()

  const dias = [
    ...Array.from({ length: relleno }, () => null),
    ...Array.from({ length: total }, (_, i) => new Date(mes.getFullYear(), mes.getMonth(), i + 1)),
  ]

  while (dias.length < 42) {
    dias.push(null)
  }

  return dias
}

function CalendarioMes({ fecha, onElegir }) {
  const [mes, setMes] = useState(() => primerDiaDelMes(fecha ? new Date(`${fecha}T00:00`) : new Date()))
  const hoy = formatearFechaParaInput(new Date())

  function moverMes(cantidad) {
    setMes((actual) => new Date(actual.getFullYear(), actual.getMonth() + cantidad, 1))
  }

  const nombreMes = mes.toLocaleDateString('es-AR', { month: 'long' })
  const titulo = `${nombreMes.charAt(0).toUpperCase()}${nombreMes.slice(1)} ${mes.getFullYear()}`

  return (
    <>
      <div className="calendario-cabecera">
        <button type="button" className="calendario-nav" onClick={() => moverMes(-1)} aria-label="Mes anterior">
          <Icono nombre="izquierda" tam={18} />
        </button>
        <span className="calendario-titulo">{titulo}</span>
        <button type="button" className="calendario-nav" onClick={() => moverMes(1)} aria-label="Mes siguiente">
          <Icono nombre="derecha" tam={18} />
        </button>
      </div>

      <div className="calendario-grilla">
        {DIAS_SEMANA.map((dia, i) => (
          <span key={i} className="calendario-semana">{dia}</span>
        ))}

        {construirDias(mes).map((dia, i) => {
          if (!dia) {
            return <span key={`vacio-${i}`} className="calendario-vacio" />
          }

          const clave = formatearFechaParaInput(dia)

          return (
            <button
              key={clave}
              type="button"
              className={`calendario-dia ${clave === fecha ? 'activo' : ''} ${clave === hoy ? 'hoy' : ''}`}
              aria-label={dia.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' })}
              aria-pressed={clave === fecha}
              onClick={() => onElegir(clave)}
            >
              {dia.getDate()}
            </button>
          )
        })}
      </div>
    </>
  )
}

export default CalendarioMes
