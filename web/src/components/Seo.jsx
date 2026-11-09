import { useEffect } from 'react'

function Seo({ titulo, descripcion }) {
  useEffect(() => {
    document.title = titulo

    const meta = document.querySelector('meta[name="description"]')
    if (meta) {
      meta.setAttribute('content', descripcion)
    }
  }, [titulo, descripcion])

  return null
}

export default Seo
