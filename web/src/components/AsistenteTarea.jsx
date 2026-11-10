import { useEffect, useRef, useState } from 'react'
import { Form } from 'react-bootstrap'
import { horaActual } from '../utils/tareas'
import CalendarioMes from './CalendarioMes'
import Icono from './Icono'
import SelectorCategoria from './SelectorCategoria'
import SelectorHoraLibre from './SelectorHoraLibre'

function AsistenteTarea({ pasos, pasoInicial, formulario, editando, onCerrar }) {
  const tarjetaRef = useRef(null)
  const [paso, setPaso] = useState(pasoInicial ?? pasos[0])

  const { titulo, categoria, fecha, hora, errores, guardando } = formulario
  const indice = pasos.indexOf(paso)
  const esUltimo = indice === pasos.length - 1
  const fechaElegida = fecha ? new Date(`${fecha}T00:00`) : null

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

  function irA(nuevoPaso) {
    if (nuevoPaso === 'hora' && !hora) {
      formulario.cambiarHora(horaActual())
    }

    setPaso(nuevoPaso)
  }

  function siguiente() {
    if (paso === 'datos' && !formulario.validarDatos()) {
      return
    }

    irA(pasos[indice + 1])
  }

  async function terminar() {
    const resultado = await formulario.enviar()

    if (resultado.ok) {
      onCerrar()
      return
    }

    if (resultado.campoConError === 'fecha') {
      setPaso('fecha')
    } else if (pasos.includes('datos')) {
      setPaso('datos')
    } else if (resultado.campoConError) {
      onCerrar()
    }
  }

  const titulos = {
    datos: editando ? 'Editar tarea' : 'Nueva tarea',
    fecha: 'Elegí la fecha',
    hora: 'Elegí la hora',
  }

  let subtitulo = 'Poné un nombre y elegí la categoría'

  if (paso !== 'datos') {
    subtitulo = fechaElegida
      ? fechaElegida.toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' })
      : 'Todavía sin fecha'

    if (paso === 'hora' && hora) {
      subtitulo += ` · ${hora}`
    }
  }

  const textoFinal = editando ? 'Guardar cambios' : 'Crear tarea'
  const siguienteDeshabilitado = paso === 'fecha' && !fecha

  return (
    <div
      className="superposicion-selector"
      onMouseDown={(evento) => {
        if (evento.target === evento.currentTarget) {
          onCerrar()
        }
      }}
    >
      <div ref={tarjetaRef} tabIndex={-1} className="tarjeta-selector" role="dialog" aria-modal="true" aria-label={titulos[paso]}>
        <div className="tarjeta-selector-cabecera">
          <div>
            <h3>{titulos[paso]}</h3>
            <p>{subtitulo}</p>
          </div>
          <button type="button" className="tarjeta-selector-cerrar" onClick={onCerrar} aria-label="Cerrar">
            <Icono nombre="cerrar" tam={16} />
          </button>
        </div>

        <div className="indicador-pasos" aria-hidden="true">
          {pasos.map((nombre, i) => (
            <span key={nombre} className={i <= indice ? 'activo' : ''} />
          ))}
        </div>

        {paso === 'datos' && (
          <div className="form-tarea" data-bs-theme="dark">
            <Form.Group controlId="titulo-asistente" className="campo-tarea">
              <Form.Label className="etiqueta-campo">Título</Form.Label>
              <Form.Control
                type="text"
                value={titulo}
                onChange={(evento) => formulario.cambiarTitulo(evento.target.value)}
                onKeyDown={(evento) => {
                  if (evento.key === 'Enter') {
                    evento.preventDefault()
                    siguiente()
                  }
                }}
                isInvalid={Boolean(errores.titulo)}
                placeholder="¿Qué tenés que hacer?"
                maxLength={120}
                autoComplete="off"
              />
              {errores.titulo && <p className="error-campo">{errores.titulo}</p>}
            </Form.Group>

            <SelectorCategoria valor={categoria} error={errores.categoria} onElegir={formulario.cambiarCategoria} />
          </div>
        )}

        {paso === 'fecha' && (
          <>
            <CalendarioMes fecha={fecha} onElegir={formulario.cambiarFecha} />
            {errores.fecha && <p className="error-campo">{errores.fecha}</p>}
          </>
        )}

        {paso === 'hora' && (
          <>
            <div className="titulo-grilla">
              <span>Hora</span>
              <button type="button" className="enlace-mini" onClick={() => formulario.cambiarHora('')} disabled={!hora}>
                Sin hora
              </button>
            </div>
            <SelectorHoraLibre hora={hora} onCambiarHora={formulario.cambiarHora} />
          </>
        )}

        <div className="tarjeta-selector-pie">
          <button
            type="button"
            className="tarjeta-selector-secundario"
            onClick={indice === 0 ? onCerrar : () => setPaso(pasos[indice - 1])}
          >
            {indice === 0 ? 'Cancelar' : 'Atrás'}
          </button>

          {esUltimo ? (
            <button type="button" className="btn btn-tareo tarjeta-selector-listo" onClick={terminar} disabled={guardando}>
              {guardando ? 'Guardando...' : textoFinal}
            </button>
          ) : (
            <button
              type="button"
              className="btn btn-tareo tarjeta-selector-listo"
              onClick={siguiente}
              disabled={siguienteDeshabilitado}
            >
              Siguiente
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

export default AsistenteTarea
