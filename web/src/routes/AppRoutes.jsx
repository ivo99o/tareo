import { Navigate, Route, Routes } from 'react-router-dom'
import Inicio from '../pages/Inicio'

function AppRoutes({ tareas, onGuardar, onEliminar }) {
  return (
    <Routes>
      <Route
        path="/"
        element={<Inicio tareas={tareas} onGuardar={onGuardar} onEliminar={onEliminar} />}
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
