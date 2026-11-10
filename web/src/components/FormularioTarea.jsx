import { useCallback, useEffect, useState } from 'react'
import { Button, Form } from 'react-bootstrap'
import { NOMBRES_CATEGORIA, describirTiempo, formatearDiaCorto, formatearFechaParaInput, formatearHora } from '../utils/tareas'
import Icono from './Icono'
import BotonSelector from './BotonSelector'
import TarjetaFechaHora from './TarjetaFechaHora'

const ICONOS_CATEGORIA = {
  laboral: 'maletin',
  estudio: 'birrete',
  recordatorio: 'campana',
}

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

function FormularioTarea({ tareaEnEdicion, onGuardar, onCancelar }) {
  const [titulo, setTitulo] = useState('')
  const [categoria, setCategoria] = useState('')
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [errores, setErrores] = useState({})
  const [tarjetaAbierta, setTarjetaAbierta] = useState(null)
  const cerrarTarjeta = useCallback(() => setTarjetaAbierta(null), [])

  useEffect(() => {
    setErrores({})

    if (tareaEnEdicion) {
      setTitulo(tareaEnEdicion.titulo)
      setCategoria(tareaEnEdicion.categoria)
      setFecha(formatearFechaParaInput(tareaEnEdicion.fechaObjetivo))
      setHora(tareaEnEdicion.fechaObjetivo.toTimeString().slice(0, 5))
    } else {
      setTitulo('')
      setCategoria('')
      setFecha('')
      setHora('')
    }
  }, [tareaEnEdicion])

  function limpiarError(campo) {
    setErrores((actuales) => ({ ...actuales, [campo]: '' }))
  }

  function elegirCategoria(valor) {
    setCategoria(valor)
    limpiarError('categoria')
  }

  function elegirFecha(valor) {
    setFecha(valor)
    limpiarError('fecha')
  }

  function manejarEnvio(evento) {
    evento.preventDefault()

    const nuevosErrores = {
      titulo: titulo.trim() ? '' : 'Escribí un título para la tarea',
      categoria: categoria ? '' : 'Elegí una categoría',
      fecha: fecha ? '' : 'Elegí una fecha objetivo',
    }

    setErrores(nuevosErrores)

    if (Object.values(nuevosErrores).some(Boolean)) {
      return
    }

    onGuardar({
      titulo: titulo.trim(),
      categoria,
      fechaObjetivo: new Date(`${fecha}T${hora || '23:59'}`),
    })
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
          onChange={(evento) => {
            setTitulo(evento.target.value)
            limpiarError('titulo')
          }}
          isInvalid={Boolean(errores.titulo)}
          placeholder="¿Qué tenés que hacer?"
          maxLength={120}
          autoComplete="off"
        />
        {errores.titulo && <p className="error-campo">{errores.titulo}</p>}
      </Form.Group>

      <div className="campo-tarea">
        <span className="etiqueta-campo" id="etiqueta-categoria">Categoría</span>
        <div className="grupo-categorias" role="radiogroup" aria-labelledby="etiqueta-categoria">
          {Object.entries(NOMBRES_CATEGORIA).map(([valor, nombre]) => (
            <button
              key={valor}
              type="button"
              role="radio"
              aria-checked={categoria === valor}
              className={`opcion-categoria ${categoria === valor ? 'activa' : ''}`}
              onClick={() => elegirCategoria(valor)}
            >
              <Icono nombre={ICONOS_CATEGORIA[valor]} tam={20} />
              <span>{nombre}</span>
            </button>
          ))}
        </div>
        {errores.categoria && <p className="error-campo">{errores.categoria}</p>}
      </div>

      <Form.Group controlId="fecha" className="campo-tarea">
        <Form.Label className="etiqueta-campo">Fecha objetivo</Form.Label>
        <div className="atajos">
          {ATAJOS_FECHA.map(({ etiqueta, dias }) => (
            <button
              key={etiqueta}
              type="button"
              className={`atajo ${fecha === fechaDentroDeDias(dias) ? 'activo' : ''}`}
              onClick={() => elegirFecha(fechaDentroDeDias(dias))}
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
          onAbrir={() => setTarjetaAbierta('fecha')}
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
              onClick={() => setHora(atajo)}
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
          onAbrir={() => setTarjetaAbierta('hora')}
          onQuitar={() => setHora('')}
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

      {tarjetaAbierta && (
        <TarjetaFechaHora
          pasoInicial={tarjetaAbierta}
          fecha={fecha}
          hora={hora}
          onCambiarFecha={elegirFecha}
          onCambiarHora={setHora}
          onCerrar={cerrarTarjeta}
        />
      )}

      <Button type="submit" variant="tareo" className="w-100 py-2 mt-2">
        {tareaEnEdicion ? 'Guardar cambios' : 'Crear tarea'}
      </Button>

      {tareaEnEdicion && (
        <button type="button" className="cancelar-edicion" onClick={onCancelar}>
          Cancelar edición
        </button>
      )}
    </Form>
  )
}

export default FormularioTarea
