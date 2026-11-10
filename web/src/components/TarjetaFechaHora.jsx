import { useEffect, useRef, useState } from 'react'
import { formatearFechaParaInput } from '../utils/tareas'
import Icono from './Icono'
import SelectorHoraLibre from './SelectorHoraLibre'

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

function TarjetaFechaHora({ pasoInicial, fecha, hora, onCambiarFecha, onCambiarHora, onCerrar }) {
  const tarjetaRef = useRef(null)
  const [paso, setPaso] = useState(pasoInicial)
  const seleccionada = fecha ? new Date(`${fecha}T00:00`) : null
  const [mes, setMes] = useState(() => primerDiaDelMes(seleccionada ?? new Date()))

  const hoy = formatearFechaParaInput(new Date())

  useEffect(() => {
    tarjetaRef.current.focus()

    function cerrarConEscape(evento) {
      if (evento.key === 'Escape') {
        evento.stopPropagation()
        onCerrar()
      }
    }

    document.addEventListener('keydown', cerrarConEscape, true)
    return () => document.removeEventListener('keydown', cerrarConEscape, true)
  }, [onCerrar])

  function moverMes(cantidad) {
    setMes((actual) => new Date(actual.getFullYear(), actual.getMonth() + cantidad, 1))
  }

  const nombreMes = mes.toLocaleDateString('es-AR', { month: 'long' })
  const titulo = `${nombreMes.charAt(0).toUpperCase()}${nombreMes.slice(1)} ${mes.getFullYear()}`
  const enPasoFecha = paso === 'fecha'

  return (
    <div
      className="superposicion-selector"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onCerrar()
        }
      }}
    >
      <div
        ref={tarjetaRef}
        tabIndex={-1}
        className="tarjeta-selector"
        role="dialog"
        aria-modal="true"
        aria-label={enPasoFecha ? 'Elegir fecha' : 'Elegir hora'}
      >
        <div className="tarjeta-selector-cabecera">
          <div>
            <h3>{enPasoFecha ? 'Elegí la fecha' : 'Elegí la hora'}</h3>
            <p>
              {seleccionada
                ? seleccionada.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
                : 'Todavía sin fecha'}
              {!enPasoFecha && hora && ` · ${hora}`}
            </p>
          </div>
          <button type="button" className="tarjeta-selector-cerrar" onClick={onCerrar} aria-label="Cerrar">
            <Icono nombre="cerrar" tam={16} />
          </button>
        </div>

        <div className="indicador-pasos" aria-hidden="true">
          <span className="activo" />
          <span className={enPasoFecha ? '' : 'activo'} />
        </div>

        {enPasoFecha ? (
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
                    onClick={() => onCambiarFecha(clave)}
                  >
                    {dia.getDate()}
                  </button>
                )
              })}
            </div>
          </>
        ) : (
          <>
            <div className="titulo-grilla">
              <span>Hora</span>
              <button type="button" className="enlace-mini" onClick={() => onCambiarHora('')} disabled={!hora}>
                Sin hora
              </button>
            </div>
            <SelectorHoraLibre hora={hora} onCambiarHora={onCambiarHora} />
          </>
        )}

        <div className="tarjeta-selector-pie">
          {enPasoFecha ? (
            <>
              <button type="button" className="tarjeta-selector-secundario" onClick={onCerrar}>
                Cancelar
              </button>
              <button
                type="button"
                className="btn btn-tareo tarjeta-selector-listo"
                onClick={() => setPaso('hora')}
                disabled={!fecha}
              >
                Siguiente
              </button>
            </>
          ) : (
            <>
              <button type="button" className="tarjeta-selector-secundario" onClick={() => setPaso('fecha')}>
                Atrás
              </button>
              <button type="button" className="btn btn-tareo tarjeta-selector-listo" onClick={onCerrar}>
                Listo
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default TarjetaFechaHora
