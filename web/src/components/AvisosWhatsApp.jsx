import { Spinner, Toast, ToastContainer } from 'react-bootstrap'
import { formatearHora } from '../utils/tareas'
import Icono from './Icono'

function AvisosWhatsApp({ avisos, onCerrar }) {
  return (
    <ToastContainer position="bottom-end" className="position-fixed p-3 contenedor-avisos">
      {avisos.map((aviso) => {
        const enviando = aviso.fase === 'enviando'

        return (
          <Toast
            key={aviso.id}
            show
            autohide={!enviando}
            delay={8000}
            onClose={() => onCerrar(aviso.id)}
            className={`aviso-wsp ${enviando ? 'enviando' : 'enviado'}`}
          >
            <div className="aviso-wsp-contenido">
              <span className="aviso-wsp-icono">
                {enviando ? (
                  <Spinner animation="border" size="sm" aria-hidden="true" />
                ) : (
                  <Icono nombre="mensaje" tam={20} />
                )}
              </span>

              <div className="aviso-wsp-texto">
                <p className="aviso-wsp-titulo">{enviando ? 'Enviando aviso...' : 'Aviso enviado por WhatsApp'}</p>
                <p className="aviso-wsp-detalle">
                  <strong>{aviso.titulo}</strong> {aviso.estado}.
                </p>
                {!enviando && (
                  <p className="aviso-wsp-pie">
                    <Icono nombre="tilde" tam={13} />
                    Enviado a {aviso.destino} · {formatearHora(aviso.hora)}
                  </p>
                )}
              </div>

              {!enviando && (
                <button type="button" className="aviso-wsp-cerrar" onClick={() => onCerrar(aviso.id)} aria-label="Cerrar aviso">
                  <Icono nombre="cerrar" tam={16} />
                </button>
              )}
            </div>
          </Toast>
        )
      })}
    </ToastContainer>
  )
}

export default AvisosWhatsApp
