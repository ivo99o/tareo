const URL_TWILIO = 'https://api.twilio.com/2010-04-01/Accounts'
const ICONOS = { AMARILLO: '🟡', NARANJA: '🟠', VENCIDA: '🔴' }
const HORA_EN_MS = 60 * 60 * 1000

function calcularEstado(fechaObjetivo) {
  const horasRestantes = (new Date(fechaObjetivo).getTime() - Date.now()) / HORA_EN_MS

  if (horasRestantes < 0) {
    return 'VENCIDA'
  }
  if (horasRestantes <= 12) {
    return 'NARANJA'
  }
  if (horasRestantes <= 24) {
    return 'AMARILLO'
  }
  return null
}

async function consultarSupabase(ruta, token) {
  const { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } = process.env

  const respuesta = await fetch(`${SUPABASE_URL}${ruta}`, {
    headers: {
      apikey: SUPABASE_PUBLISHABLE_KEY,
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  })

  const datos = await respuesta.json().catch(() => null)

  return { ok: respuesta.ok, datos }
}

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

  const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM, SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } =
    process.env

  if (!TWILIO_ACCOUNT_SID || !TWILIO_AUTH_TOKEN || !TWILIO_WHATSAPP_FROM || !SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
    return res.status(500).json({ error: 'El servidor no tiene configuradas las credenciales necesarias.' })
  }

  const token = (req.headers.authorization ?? '').replace(/^Bearer /, '')

  if (!token) {
    return res.status(401).json({ error: 'Tenés que iniciar sesión para enviar avisos.' })
  }

  const { tareaId } = req.body ?? {}

  if (!Number.isInteger(tareaId) || tareaId <= 0) {
    return res.status(400).json({ error: 'Faltan datos o son inválidos.' })
  }

  let usuario
  let tarea
  let perfil

  try {
    const sesion = await consultarSupabase('/auth/v1/user', token)

    if (!sesion.ok) {
      return res.status(401).json({ error: 'Tu sesión no es válida. Volvé a iniciar sesión.' })
    }

    usuario = sesion.datos

    const consultaTarea = await consultarSupabase(
      `/rest/v1/tareas?select=titulo,fecha_objetivo&id=eq.${tareaId}`,
      token,
    )
    tarea = consultaTarea.ok ? consultaTarea.datos?.[0] : undefined

    const consultaPerfil = await consultarSupabase(
      `/rest/v1/perfiles?select=telefono&id=eq.${encodeURIComponent(usuario.id)}`,
      token,
    )
    perfil = consultaPerfil.ok ? consultaPerfil.datos?.[0] : undefined
  } catch {
    return res.status(502).json({ error: 'No se pudo conectar con la base de datos.' })
  }

  if (!tarea) {
    return res.status(404).json({ error: 'La tarea no existe.' })
  }

  const estado = calcularEstado(tarea.fecha_objetivo)

  if (!estado) {
    return res.status(400).json({ error: 'La tarea todavía no necesita un aviso.' })
  }

  if (!perfil?.telefono) {
    return res.status(400).json({ error: 'Todavía no cargaste tu teléfono para recibir avisos.' })
  }

  const destino = normalizarTelefono(perfil.telefono)

  if (!/^\+\d{10,15}$/.test(destino)) {
    return res.status(400).json({ error: 'El número de teléfono no es válido.' })
  }

  const cuerpo = new URLSearchParams({
    From: `whatsapp:${TWILIO_WHATSAPP_FROM}`,
    To: `whatsapp:${destino}`,
    Body: `${ICONOS[estado]} Tu tarea "${String(tarea.titulo).slice(0, 80)}" está en estado ${estado}.`,
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

    return res.status(201).json({ sid: datos.sid, estado: datos.status, destino, estadoTarea: estado })
  } catch {
    return res.status(502).json({ error: 'No se pudo conectar con Twilio.' })
  }
}
