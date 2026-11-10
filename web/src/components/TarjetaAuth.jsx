import { Card, Container } from 'react-bootstrap'

function TarjetaAuth({ titulo, subtitulo, children }) {
  return (
    <Container fluid className="fondo-auth pantalla-completa d-flex align-items-center justify-content-center p-2 p-sm-3">
      <Card className="tarjeta-auth w-100 border-0 rounded-4 shadow-lg">
        <Card.Body className="px-4 py-3 p-sm-5">
          <div className="text-center mb-3 mb-sm-4">
            <img src="/tareo-logo.svg" alt="tareo" height="44" className="logo-auth" />
          </div>

          <h1 className="h4 fw-bold text-center mb-1">{titulo}</h1>
          <p className="text-center text-body-secondary mb-3 mb-sm-4">{subtitulo}</p>

          {children}
        </Card.Body>
      </Card>
    </Container>
  )
}

export default TarjetaAuth
