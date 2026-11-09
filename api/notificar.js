const URL_TWILIO = 'https://api.twilio.com/2010-04-01/Accounts'
const ESTADOS_VALIDOS = ['AMARILLO', 'NARANJA', 'VENCIDA']
const ICONOS = { AMARILLO: '🟡', NARANJA: '🟠', VENCIDA: '🔴' }

function normalizarTelefono(telefono) {
  const texto = String(telefono).trim()
  let digitos = texto.replace(/\D/g, '')

  if (texto.startsWith('+')) {
    return `+${digitos}`
  }

  digitos = digitos.replace(/^0+/, '')

  if (digitos.startsWith('54')) {
    digitos = digitos.slice(2)
  }

  if (digitos.startsWith('9') && digitos.length === 11) {
    digitos = digitos.slice(1)
  }

  if (digitos.length === 12) {
    digitos = digitos.replace(/^(\d{2,4}?)15(\d{6,8})$/, '$1$2')
  }

  return `+549${digitos}`
}

function traducirError(datos) {
  if (datos.code === 63015) {
    return 'Ese número todavía no se unió al sandbox de Twilio. Tiene que enviar el mensaje de unión al número del sandbox desde WhatsApp.'
  }
  if (datos.code === 21211) {
    return 'El número de teléfono no es válido.'
  }
  return datos.message ?? 'Twilio rechazó el mensaje.'
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Método no permitido.' })
  }

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM } = process.env

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM) {
    return res.status(500).json({ error: 'El servidor no tiene configuradas las credenciales de Twilio.' })
  }

  const { telefono, titulo, estado } = req.body ?? {}

  if (!telefono || !titulo || !ESTADOS_VALIDOS.includes(estado)) {
    return res.status(400).json({ error: 'Faltan datos o son inválidos.' })
  }

  const destino = normalizarTelefono(telefono)

  if (!/^\+\d{10,15}$/.test(destino)) {
    return res.status(400).json({ error: 'El número de teléfono no es válido.' })
  }

  const cuerpo = new URLSearchParams({
    From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
    To: `whatsapp:${destino}`,
    Body: `${ICONOS[estado]} Tu tarea "${String(titulo).slice(0, 80)}" está en estado ${estado}.`,
  })

  const credenciales = Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')

  try {
    const respuesta = await fetch(`${URL_TWILIO}/${TWILIO_ACCOUNT_SID}/Messages.json`, {
      method: 'POST',
      headers: {
        Authorization: `Basic ${credenciales}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: cuerpo,
    })

    const datos = await respuesta.json()

    if (!respuesta.ok) {
      return res.status(respuesta.status).json({ error: traducirError(datos) })
    }

    return res.status(201).json({ sid: datos.sid, estado: datos.status, destino })
  } catch {
    return res.status(502).json({ error: 'No se pudo conectar con Twilio.' })
  }
}
