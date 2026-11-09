import { useState } from 'react'
import { Button, Col, Container, Row } from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import Filtros from '../components/Filtros'
import ListaTareas from '../components/ListaTareas'
import Seo from '../components/Seo'
import useAuth from '../hooks/useAuth'
import { calcularEstado } from '../utils/tareas'

function Inicio({ tareas, onGuardar, onEliminar }) {
  const { usuario, cerrarSesion } = useAuth()
  const [idEnEdicion, setIdEnEdicion] = useState(null)
  const [sidebarAbierta, setSidebarAbierta] = useState(false)
  const [filtroCategoriaActivo, setFiltroCategoriaActivo] = useState('todos')
  const [soloPendientes, setSoloPendientes] = useState(false)

  const tareaEnEdicion = tareas.find((tarea) => tarea.id === idEnEdicion) || null

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
      return
    }

    setIdEnEdicion(null)
    setSidebarAbierta(false)
  }

  async function eliminarTarea(id) {
    const eliminada = await onEliminar(id)

    if (eliminada && idEnEdicion === id) {
      setIdEnEdicion(null)
    }
  }

  function iniciarEdicion(id) {
    setIdEnEdicion(id)
    setSidebarAbierta(true)
  }

  return (
    <Container as="main" fluid className="bg-body-secondary min-vh-100 p-0">
      <Seo
        titulo="Gestor de Tareas | Organizá tus tareas por categoría y fecha"
        descripcion="Creá, editá y filtrá tus tareas por categoría. Cada tarea cambia de color según qué tan cerca está su fecha objetivo."
      />

      <Row className="g-0 min-vh-100 align-content-start align-content-lg-stretch">
        <Col lg={3} className="bg-dark">
          <Sidebar
            abierta={sidebarAbierta}
            onAbrir={() => setSidebarAbierta(true)}
            onCerrar={() => setSidebarAbierta(false)}
            tareaEnEdicion={tareaEnEdicion}
            onGuardar={guardarTarea}
          />
        </Col>

        <Col as="section" lg={9} className="py-4 px-3 px-md-4">
          <header className="d-flex justify-content-end align-items-center gap-3 mb-2">
            <span className="small text-body-secondary text-truncate">{usuario.email}</span>
            <Button variant="outline-secondary" size="sm" onClick={cerrarSesion}>
              Cerrar sesión
            </Button>
          </header>

          <h1 className="h2 text-center mb-4">Tareas</h1>

          <Filtros
            filtroCategoriaActivo={filtroCategoriaActivo}
            soloPendientes={soloPendientes}
            onCambiarCategoria={setFiltroCategoriaActivo}
            onAlternarPendientes={() => setSoloPendientes((actual) => !actual)}
          />

          <ListaTareas tareas={tareasAMostrar} onEditar={iniciarEdicion} onEliminar={eliminarTarea} />
        </Col>
      </Row>
    </Container>
  )
}

export default Inicio
