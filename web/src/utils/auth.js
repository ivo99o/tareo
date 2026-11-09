const MENSAJES_DE_ERROR = {
  invalid_credentials: 'El correo o la contraseña no son correctos.',
  email_not_confirmed: 'Todavía no confirmaste tu correo. Revisá tu bandeja de entrada.',
  user_already_exists: 'Ese correo ya está registrado. Iniciá sesión.',
  weak_password: 'La contraseña es muy débil. Usá al menos 6 caracteres.',
  over_email_send_rate_limit: 'Se enviaron demasiados correos. Esperá unos minutos e intentá de nuevo.',
  over_request_rate_limit: 'Hiciste demasiados intentos. Esperá unos minutos e intentá de nuevo.',
}

export function obtenerMensajeDeErrorAuth(error) {
  return MENSAJES_DE_ERROR[error.code] ?? 'No se pudo completar la operación. Intentá de nuevo.'
}
