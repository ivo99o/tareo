import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import Filtros from '../components/Filtros'
import ListaTareas from '../components/ListaTareas'
import Icono from '../components/Icono'
import Seo from '../components/Seo'
import useAuth from '../hooks/useAuth'
import { calcularEstado } from '../utils/tareas'

function Inicio({ tareas, telefono, onGuardar, onEliminar, onAbrirTelefono }) {
  const { usuario, cerrarSesion } = useAuth()
  const [idEnEdicion, setIdEnEdicion] = useState(null)
  const [sidebarAbierta, setSidebarAbierta] = useState(false)
  const [filtroCategoriaActivo, setFiltroCategoriaActivo] = useState('todos')
  const [soloPendientes, setSoloPendientes] = useState(false)

  const tareaEnEdicion = tareas.find((tarea) => tarea.id === idEnEdicion) || null

  const conteos = tareas.reduce(
    (acumulado, tarea) => ({ ...acumulado, [tarea.categoria]: (acumulado[tarea.categoria] ?? 0) + 1 }),
    { todos: tareas.length },
  )
  const vencidas = tareas.filter((tarea) => calcularEstado(tarea.fechaObjetivo).clave === 'vencida').length

  const tareasAMostrar = tareas
    .filter((tarea) => {
      const coincideCategoria = filtroCategoriaActivo === 'todos' || tarea.categoria === filtroCategoriaActivo
      const coincidePendiente = !soloPendientes || calcularEstado(tarea.fechaObjetivo).clave === 'pendiente'
      return coincideCategoria && coincidePendiente
    })
    .sort((a, b) => a.fechaObjetivo - b.fechaObjetivo)

  async function guardarTarea(datosTarea) {
    const guardada = await onGuardar(datosTarea, idEnEdicion)

    if (!guardada) {
      return false
    }

    setIdEnEdicion(null)
    setSidebarAbierta(false)
    return true
  }

  async function eliminarTarea(id) {
    const eliminada = await onEliminar(id)

    if (eliminada && idEnEdicion === id) {
      setIdEnEdicion(null)
    }
  }

  function cancelarEdicion() {
    setIdEnEdicion(null)
    setSidebarAbierta(false)
  }

  function iniciarEdicion(id) {
    setIdEnEdicion(id)
    setSidebarAbierta(true)
  }

  const inicial = usuario.email.charAt(0).toUpperCase()

  return (
    <Container as="main" fluid className="fondo-panel pagina-panel p-0">
      <Seo
        titulo="tareo | Organizá tus tareas por categoría y fecha"
        descripcion="Creá, editá y filtrá tus tareas por categoría. Cada tarea cambia de color según qué tan cerca está su fecha objetivo."
      />

      <Row className="g-0 fila-panel align-content-start align-content-lg-stretch">
        <Col lg={3} className="panel-lateral">
          <div className="panel-lateral-fijo">
            <Sidebar
              abierta={sidebarAbierta}
              onAbrir={() => setSidebarAbierta(true)}
              tareaEnEdicion={tareaEnEdicion}
              onGuardar={guardarTarea}
              onCancelarEdicion={cancelarEdicion}
            />
          </div>
        </Col>

        <Col as="section" lg={9} className="contenido-principal">
          <div className="cabecera-fija">
          <header className="barra-usuario">
            <img src="/tareo-logo.svg" alt="tareo" height="30" className="d-lg-none" />

            <div className="barra-usuario-datos">
              <span className="avatar-usuario" aria-hidden="true">{inicial}</span>
              <span className="barra-usuario-email">{usuario.email}</span>
            </div>

            <div className="barra-usuario-acciones">
              <button
                type="button"
                className={`boton-aviso ${telefono ? 'activo' : ''}`}
                onClick={onAbrirTelefono}
              >
                <Icono nombre="mensaje" tam={16} />
                <span className="d-none d-sm-inline">{telefono ? 'Avisos activos' : 'Activar avisos'}</span>
                <span className="d-sm-none">{telefono ? 'Avisos' : 'Activar'}</span>
                <span className="punto-aviso" aria-hidden="true" />
              </button>

              <button type="button" className="boton-salir" onClick={cerrarSesion} aria-label="Cerrar sesión">
                <Icono nombre="salir" tam={16} />
                <span className="d-none d-sm-inline">Salir</span>
              </button>
            </div>
          </header>

          <div className="encabezado-tareas">
            <h1 className="h3 mb-0">Tus tareas</h1>
            <p className="mb-0">
              {tareas.length === 0
                ? 'Todavía no cargaste ninguna'
                : `${tareas.length} ${tareas.length === 1 ? 'tarea' : 'tareas'}${vencidas > 0 ? ` · ${vencidas} ${vencidas === 1 ? 'vencida' : 'vencidas'}` : ''}`}
            </p>
          </div>

          <Filtros
            filtroCategoriaActivo={filtroCategoriaActivo}
            soloPendientes={soloPendientes}
            conteos={conteos}
            onCambiarCategoria={setFiltroCategoriaActivo}
            onAlternarPendientes={() => setSoloPendientes((actual) => !actual)}
          />
          </div>

          <div className="zona-lista">
            <ListaTareas
              tareas={tareasAMostrar}
              hayTareas={tareas.length > 0}
              onEditar={iniciarEdicion}
              onEliminar={eliminarTarea}
            />
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default Inicio
