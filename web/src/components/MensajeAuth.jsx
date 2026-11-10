import { Alert } from 'react-bootstrap'

function MensajeAuth({ tipo = 'danger', children }) {
  return (
    <Alert variant={tipo} className="border-0 rounded-3 py-2 px-3 small mb-3" role="alert">
      {children}
    </Alert>
  )
}

export default MensajeAuth
