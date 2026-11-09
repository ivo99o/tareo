import { Button } from 'react-bootstrap'

function BotonEliminar({ onClick }) {
  return (
    <Button variant="dark" size="sm" onClick={onClick}>
      Eliminar
    </Button>
  )
}

export default BotonEliminar
