import { useEffect, useRef, useState } from 'react'
import Icono from './Icono'

const ATAJOS_HORA = ['09:00', '12:00', '18:00', '21:00']
const ATAJOS_MINUTOS = ['00', '15', '30', '45']

function completar(numero) {
  return String(numero).padStart(2, '0')
}

function BotonPaso({ etiqueta, icono, onPaso }) {
  const pasoRef = useRef(onPaso)
  const retraso = useRef(null)
  const repetidor = useRef(null)

  useEffect(() => {
    pasoRef.current = onPaso
  })

  function detener() {
    clearTimeout(retraso.current)
    clearInterval(repetidor.current)
  }

  useEffect(() => detener, [])

  function iniciar(evento) {
    evento.preventDefault()
    pasoRef.current()
    retraso.current = setTimeout(() => {
      repetidor.current = setInterval(() => pasoRef.current(), 90)
    }, 400)
  }

  function manejarTeclado(evento) {
    if (evento.key === 'Enter' || evento.key === ' ') {
      evento.preventDefault()
      pasoRef.current()
    }
  }

  return (
    <button
      type="button"
      className="boton-paso"
      aria-label={etiqueta}
      onPointerDown={iniciar}
      onPointerUp={detener}
      onPointerLeave={detener}
      onPointerCancel={detener}
      onKeyDown={manejarTeclado}
    >
      <Icono nombre={icono} tam={20} />
    </button>
  )
}

function SelectorHoraLibre({ hora, onCambiarHora }) {
  const [horas, setHoras] = useState(hora.slice(0, 2))
  const [minutos, setMinutos] = useState(hora.slice(3, 5))
  const valores = useRef({ horas, minutos })
  const ultimoEnviado = useRef(hora)
  const minutosRef = useRef(null)

  useEffect(() => {
    if (hora !== ultimoEnviado.current) {
      ultimoEnviado.current = hora
      valores.current = { horas: hora.slice(0, 2), minutos: hora.slice(3, 5) }
      setHoras(valores.current.horas)
      setMinutos(valores.current.minutos)
    }
  }, [hora])

  function confirmar(h, m) {
    const valor = `${completar(h)}:${completar(m)}`
    ultimoEnviado.current = valor
    valores.current = { horas: completar(h), minutos: completar(m) }
    setHoras(valores.current.horas)
    setMinutos(valores.current.minutos)
    onCambiarHora(valor)
  }

  function valorActual() {
    const { horas: h, minutos: m } = valores.current

    if (h === '' && m === '') {
      const ahora = new Date()
      return { h: ahora.getHours(), m: ahora.getMinutes() }
    }

    return { h: Number(h || 0), m: Number(m || 0) }
  }

  function mover(campo, delta) {
    const { h, m } = valorActual()

    if (campo === 'horas') {
      confirmar((h + delta + 24) % 24, m)
    } else {
      confirmar(h, (m + delta + 60) % 60)
    }
  }

  function escribir(campo, texto) {
    const limite = campo === 'horas' ? 23 : 59
    let limpio = texto.replace(/\D/g, '').slice(0, 2)

    if (limpio.length === 2 && Number(limpio) > limite) {
      limpio = String(limite)
    }

    valores.current = { ...valores.current, [campo]: limpio }

    if (campo === 'horas') {
      setHoras(limpio)
      if (limpio.length === 2) {
        minutosRef.current.focus()
      }
    } else {
      setMinutos(limpio)
    }
  }

  function normalizar() {
    const { horas: h, minutos: m } = valores.current

    if (h === '' && m === '') {
      return
    }

    confirmar(Number(h || 0), Number(m || 0))
  }

  function manejarTeclado(evento, campo) {
    if (evento.key === 'Enter') {
      evento.preventDefault()
      evento.currentTarget.blur()
    } else if (evento.key === 'ArrowUp') {
      evento.preventDefault()
      mover(campo, 1)
    } else if (evento.key === 'ArrowDown') {
      evento.preventDefault()
      mover(campo, -1)
    }
  }

  function elegirMinutos(valor) {
    confirmar(valorActual().h, Number(valor))
  }

  function elegirAtajo(atajo) {
    confirmar(Number(atajo.slice(0, 2)), Number(atajo.slice(3, 5)))
  }

  return (
    <>
      <div className="reloj-libre">
        <div className="columna-reloj">
          <BotonPaso etiqueta="Subir hora" icono="arriba" onPaso={() => mover('horas', 1)} />
          <input
            type="text"
            inputMode="numeric"
            maxLength={2}
            autoComplete="off"
            className="entrada-reloj"
            aria-label="Horas"
            placeholder="--"
            value={horas}
            onChange={(evento) => escribir('horas', evento.target.value)}
            onFocus={(evento) => evento.target.select()}
            onBlur={normalizar}
            onKeyDown={(evento) => manejarTeclado(evento, 'horas')}
          />
          <BotonPaso etiqueta="Bajar hora" icono="abajo" onPaso={() => mover('horas', -1)} />
          <span className="etiqueta-reloj">horas</span>
        </div>

        <span className="separador-reloj">:</span>

        <div className="columna-reloj">
          <BotonPaso etiqueta="Subir minutos" icono="arriba" onPaso={() => mover('minutos', 1)} />
          <input
            ref={minutosRef}
            type="text"
            inputMode="numeric"
            maxLength={2}
            autoComplete="off"
            className="entrada-reloj"
            aria-label="Minutos"
            placeholder="--"
            value={minutos}
            onChange={(evento) => escribir('minutos', evento.target.value)}
            onFocus={(evento) => evento.target.select()}
            onBlur={normalizar}
            onKeyDown={(evento) => manejarTeclado(evento, 'minutos')}
          />
          <BotonPaso etiqueta="Bajar minutos" icono="abajo" onPaso={() => mover('minutos', -1)} />
          <span className="etiqueta-reloj">minutos</span>
        </div>
      </div>

      <p className="ayuda-reloj">Escribila, usá las flechas o mantené apretado para avanzar rápido.</p>

      <div className="titulo-grilla">
        <span>Minutos</span>
      </div>
      <div className="atajos">
        {ATAJOS_MINUTOS.map((atajo) => (
          <button
            key={atajo}
            type="button"
            className={`atajo ${minutos === atajo ? 'activo' : ''}`}
            onClick={() => elegirMinutos(atajo)}
          >
            :{atajo}
          </button>
        ))}
      </div>

      <div className="titulo-grilla">
        <span>Horarios frecuentes</span>
      </div>
      <div className="atajos">
        {ATAJOS_HORA.map((atajo) => (
          <button
            key={atajo}
            type="button"
            className={`atajo ${hora === atajo ? 'activo' : ''}`}
            onClick={() => elegirAtajo(atajo)}
          >
            {atajo}
          </button>
        ))}
      </div>
    </>
  )
}

export default SelectorHoraLibre
