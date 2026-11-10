const PATRON_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const DIGITOS_MINIMOS_TELEFONO = 8

export function validarEmail(email) {
  const valor = email.trim()

  if (!valor) {
    return 'Ingresá tu correo electrónico.'
  }

  if (!PATRON_EMAIL.test(valor)) {
    return 'El correo no es válido.'
  }

  return ''
}

export function validarPassword(password, largoMinimo = 0) {
  if (!password) {
    return 'Ingresá tu contraseña.'
  }

  if (largoMinimo && password.length < largoMinimo) {
    return `Debe tener al menos ${largoMinimo} caracteres.`
  }

  return ''
}

export function validarRepeticion(password, repetida) {
  if (!repetida) {
    return 'Repetí tu contraseña.'
  }

  if (password !== repetida) {
    return 'Las contraseñas no coinciden.'
  }

  return ''
}

export function validarTelefono(telefono) {
  if (!telefono.trim()) {
    return 'Ingresá tu número de teléfono.'
  }

  if (telefono.replace(/\D/g, '').length < DIGITOS_MINIMOS_TELEFONO) {
    return 'El teléfono no es válido.'
  }

  return ''
}
