import { Button } from 'react-bootstrap'

function BotonEditar({ onClick }) {
  return (
    <Button variant="light" size="sm" onClick={onClick}>
      Editar
    </Button>
  )
}

export default BotonEditar
