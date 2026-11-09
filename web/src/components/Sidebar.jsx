import { Button, Col, Offcanvas, Row } from 'react-bootstrap'
import FormularioTarea from './FormularioTarea'

function Sidebar({ abierta, onAbrir, onCerrar, tareaEnEdicion, onGuardar }) {
  return (
    <>
      {!abierta && (
        <Button
          variant="primary"
          className="d-lg-none position-fixed bottom-0 end-0 z-3 m-4 rounded-circle px-3 py-2 fs-2 lh-1 shadow"
          aria-label="Agregar tarea"
          onClick={onAbrir}
        >
          +
        </Button>
      )}

      <Offcanvas
        show={abierta}
        onHide={onCerrar}
        responsive="lg"
        placement="top"
        className="vh-100 text-bg-dark"
      >
        <Offcanvas.Header closeButton closeVariant="white" />

        <Offcanvas.Body className="py-4 px-3">
          <Row className="g-0 w-100 justify-content-center">
            <Col xs={12} sm={8} md={6} lg={12} xl={10}>
              <div className="text-center mb-4">
                <h2 className="h4 d-inline-block border-bottom border-2 pb-1">Agregar Tarea</h2>
              </div>

              <FormularioTarea tareaEnEdicion={tareaEnEdicion} onGuardar={onGuardar} />
            </Col>
          </Row>
        </Offcanvas.Body>
      </Offcanvas>
    </>
  )
}

export default Sidebar
