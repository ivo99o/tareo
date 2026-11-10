import { useCallback, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { describirTiempo, formatearDiaCorto, formatearFechaParaInput, formatearHora, horaActual } from '../utils/tareas'
import AsistenteTarea from './AsistenteTarea'
import BotonSelector from './BotonSelector'
import Icono from './Icono'
import SelectorCategoria from './SelectorCategoria'

const ATAJOS_FECHA = [
  { etiqueta: 'Hoy', dias: 0 },
  { etiqueta: 'Mañana', dias: 1 },
  { etiqueta: 'En 1 semana', dias: 7 },
]

const ATAJOS_HORA = ['09:00', '12:00', '18:00', '21:00']

function fechaDentroDeDias(dias) {
  const fecha = new Date()
  fecha.setDate(fecha.getDate() + dias)
  return formatearFechaParaInput(fecha)
}

function FormularioTarea({ formulario, editando, onCancelar }) {
  const { titulo, categoria, fecha, hora, errores, guardando } = formulario
  const [pasoAbierto, setPasoAbierto] = useState(null)
  const cerrarAsistente = useCallback(() => setPasoAbierto(null), [])

  function abrirHora() {
    if (!fecha) {
      setPasoAbierto('fecha')
      return
    }

    if (!hora) {
      formulario.cambiarHora(horaActual())
    }

    setPasoAbierto('hora')
  }

  function manejarEnvio(evento) {
    evento.preventDefault()
    formulario.enviar()
  }

  const fechaCompleta = fecha ? new Date(`${fecha}T${hora || '23:59'}`) : null
  const vistaPrevia = fechaCompleta && !Number.isNaN(fechaCompleta.getTime()) ? fechaCompleta : null

  return (
    <Form noValidate data-bs-theme="dark" className="form-tarea" onSubmit={manejarEnvio}>
      <Form.Group controlId="titulo" className="campo-tarea">
        <Form.Label className="etiqueta-campo">Título</Form.Label>
        <Form.Control
          type="text"
          value={titulo}
          onChange={(evento) => formulario.cambiarTitulo(evento.target.value)}
          isInvalid={Boolean(errores.titulo)}
          placeholder="¿Qué tenés que hacer?"
          maxLength={120}
          autoComplete="off"
        />
        {errores.titulo && <p className="error-campo">{errores.titulo}</p>}
      </Form.Group>

      <SelectorCategoria valor={categoria} error={errores.categoria} onElegir={formulario.cambiarCategoria} />

      <Form.Group controlId="fecha" className="campo-tarea">
        <Form.Label className="etiqueta-campo">Fecha objetivo</Form.Label>
        <div className="atajos">
          {ATAJOS_FECHA.map(({ etiqueta, dias }) => (
            <button
              key={etiqueta}
              type="button"
              className={`atajo ${fecha === fechaDentroDeDias(dias) ? 'activo' : ''}`}
              onClick={() => formulario.cambiarFecha(fechaDentroDeDias(dias))}
            >
              {etiqueta}
            </button>
          ))}
        </div>
        <BotonSelector
          id="fecha"
          icono="calendario"
          texto={
            fecha
              ? new Date(`${fecha}T00:00`).toLocaleDateString('es-AR', { weekday: 'short', day: 'numeric', month: 'short', year: 'numeric' })
              : 'Elegí una fecha'
          }
          vacio={!fecha}
          invalido={Boolean(errores.fecha)}
          onAbrir={() => setPasoAbierto('fecha')}
        />
        {errores.fecha && <p className="error-campo">{errores.fecha}</p>}
      </Form.Group>

      <div className="campo-tarea">
        <span className="etiqueta-campo">Hora <span className="opcional">(opcional)</span></span>
        <div className="atajos">
          {ATAJOS_HORA.map((atajo) => (
            <button
              key={atajo}
              type="button"
              className={`atajo ${hora === atajo ? 'activo' : ''}`}
              onClick={() => formulario.cambiarHora(atajo)}
            >
              {atajo}
            </button>
          ))}
        </div>
        <BotonSelector
          id="hora"
          icono="reloj"
          texto={hora || 'Sin hora (queda 23:59)'}
          vacio={!hora}
          onAbrir={abrirHora}
          onQuitar={() => formulario.cambiarHora('')}
        />
      </div>

      {vistaPrevia && (
        <p className="vista-previa-fecha">
          <Icono nombre="calendario" tam={15} />
          <span>
            Vence <strong>{formatearDiaCorto(vistaPrevia)} · {formatearHora(vistaPrevia)}</strong>
            <em> ({describirTiempo(vistaPrevia)})</em>
          </span>
        </p>
      )}

      {pasoAbierto && (
        <AsistenteTarea
          pasos={['fecha', 'hora']}
          pasoInicial={pasoAbierto}
          formulario={formulario}
          editando={editando}
          onCerrar={cerrarAsistente}
        />
      )}

      <Button type="submit" variant="tareo" className="w-100 py-2 mt-2" disabled={guardando}>
        {guardando ? 'Guardando...' : editando ? 'Guardar cambios' : 'Crear tarea'}
      </Button>

      {editando && (
        <button type="button" className="cancelar-edicion" onClick={onCancelar}>
          Cancelar edición
        </button>
      )}
    </Form>
  )
}

export default FormularioTarea
