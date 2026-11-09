import { Navigate, Outlet } from 'react-router-dom'
import PantallaCarga from '../components/PantallaCarga'
import useAuth from '../hooks/useAuth'

function RutaPublica() {
  const { usuario, cargando } = useAuth()

  if (cargando) {
    return <PantallaCarga />
  }

  return usuario ? <Navigate to="/" replace /> : <Outlet />
}

export default RutaPublica
