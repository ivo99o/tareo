import { Navigate, Outlet } from 'react-router-dom'
import PantallaCarga from '../components/PantallaCarga'
import useAuth from '../hooks/useAuth'

function RutaPrivada() {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return <PantallaCarga />
  }

  return usuario ? <Outlet /> : <Navigate to="/login" replace />
}

export default RutaPrivada
