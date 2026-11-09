import { useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import Sidebar from '../components/Sidebar'
import Filtros from '../components/Filtros'
import ListaTareas from '../components/ListaTareas'
import Seo from '../components/Seo'
import { calcularEstado } from '../utils/tareas'

function Inicio({ tareas, onGuardar, onEliminar }) {
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

  function guardarTarea(datosTarea) {
    onGuardar(datosTarea, idEnEdicion)
    setIdEnEdicion(null)
    setSidebarAbierta(false)
  }

  function eliminarTarea(id) {
    onEliminar(id)

    if (idEnEdicion === id) {
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
