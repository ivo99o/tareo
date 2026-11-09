import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { AuthContext } from './AuthContext'

function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setSesion(data.session)
      setCargando(false)
    })

    const { data } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSesion(nuevaSesion)
    })

    return () => data.subscription.unsubscribe()
  }, [])

  async function registrarse(email, password) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo: window.location.origin },
    })

    if (error) {
      throw error
    }

    if (data.user?.identities?.length === 0) {
      const errorYaRegistrado = new Error('El correo ya está registrado')
      errorYaRegistrado.code = 'user_already_exists'
      throw errorYaRegistrado
    }
  }

  async function iniciarSesion(email, password) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      throw error
    }
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
  }

  const valor = {
    usuario: sesion?.user ?? null,
    cargando,
    registrarse,
    iniciarSesion,
    cerrarSesion,
  }

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>
}

export default AuthProvider
