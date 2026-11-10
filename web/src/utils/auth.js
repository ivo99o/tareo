const ERRORES_DE_AUTENTICACION = {
  invalid_credentials: { texto: 'El correo o la contraseña no son correctos.', tipo: 'danger' },
  email_not_confirmed: {
    texto: 'Todavía no confirmaste tu correo. Revisá tu bandeja de entrada.',
    tipo: 'warning',
  },
  user_already_exists: { texto: 'Ese correo ya está registrado. Iniciá sesión.', tipo: 'warning' },
  weak_password: { texto: 'La contraseña es muy débil. Usá al menos 6 caracteres.', tipo: 'danger' },
  over_email_send_rate_limit: {
    texto: 'Se enviaron demasiados correos. Esperá unos minutos e intentá de nuevo.',
    tipo: 'warning',
  },
  over_request_rate_limit: {
    texto: 'Hiciste demasiados intentos. Esperá unos minutos e intentá de nuevo.',
    tipo: 'warning',
  },
}

export function describirErrorAuth(error) {
  return (
    ERRORES_DE_AUTENTICACION[error.code] ?? {
      texto: 'No se pudo completar la operación. Intentá de nuevo.',
      tipo: 'danger',
    }
  )
}
