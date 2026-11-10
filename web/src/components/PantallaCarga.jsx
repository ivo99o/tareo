import { Container, Spinner } from 'react-bootstrap'

function PantallaCarga() {
  return (
    <Container fluid className="bg-body-secondary pantalla-completa d-flex align-items-center justify-content-center">
      <Spinner animation="border" role="status">
        <span className="visually-hidden">Cargando...</span>
      </Spinner>
    </Container>
  )
}

export default PantallaCarga
