import { useEffect, useState } from 'react'

const CONSULTA = '(min-width: 992px)'

function useEsEscritorio() {
  const [esEscritorio, setEsEscritorio] = useState(() => window.matchMedia(CONSULTA).matches)

  useEffect(() => {
    const consulta = window.matchMedia(CONSULTA)
    const actualizar = () => setEsEscritorio(consulta.matches)

    consulta.addEventListener('change', actualizar)
    return () => consulta.removeEventListener('change', actualizar)
  }, [])

  return esEscritorio
}

export default useEsEscritorio
