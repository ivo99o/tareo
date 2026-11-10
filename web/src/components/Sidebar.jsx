import { Offcanvas } from 'react-bootstrap'
import FormularioTarea from './FormularioTarea'
import Icono from './Icono'

function Sidebar({ abierta, onAbrir, onCerrar, tareaEnEdicion, onGuardar, onCancelarEdicion }) {
  return (
    <>
      {!abierta && (
        <button type="button" className="boton-flotante d-lg-none" aria-label="Agregar tarea" onClick={onAbrir}>
          <Icono nombre="plus" tam={28} />
        </button>
      )}

      <Offcanvas show={abierta} onHide={onCerrar} responsive="lg" placement="top" className="sidebar-tareo vh-100">
        <Offcanvas.Header closeButton closeVariant="white" />

        <Offcanvas.Body className="py-4 px-3">
          <div className="contenido-sidebar">
            <div className="d-none d-lg-block text-center mb-4">
              <img src="/tareo-logo-claro.svg" alt="tareo" height="40" />
            </div>

            <div className="titulo-sidebar">
              <h2 className="h5 mb-0">{tareaEnEdicion ? 'Editar tarea' : 'Nueva tarea'}</h2>
              <p className="mb-0">
                {tareaEnEdicion ? 'Cambiá lo que necesites y guardá.' : 'Completá los datos y listo.'}
              </p>
            </div>

            <FormularioTarea
              tareaEnEdicion={tareaEnEdicion}
              onGuardar={onGuardar}
              onCancelar={onCancelarEdicion}
            />
          </div>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Sidebar
