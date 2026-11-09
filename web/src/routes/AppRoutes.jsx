import { Navigate, Route, Routes } from 'react-router-dom'
import Login from '../pages/Login'
import PanelTareas from '../pages/PanelTareas'
import Registro from '../pages/Registro'
import RutaPrivada from './RutaPrivada'
import RutaPublica from './RutaPublica'

function AppRoutes() {
  return (
    <Routes>
      <Route element={<RutaPublica />}>
        <Route path="/login" element={<Login />} />
        <Route path="/registro" element={<Registro />} />
      </Route>

      <Route element={<RutaPrivada />}>
        <Route path="/" element={<PanelTareas />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
