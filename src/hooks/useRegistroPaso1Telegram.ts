import { useState } from 'react'
import { toast } from 'sonner'

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || ''

export function useRegistroPaso1Telegram() {
  const [loading, setLoading] = useState(false)

  const crear = async (datos: {
    nombre_completo: string
    edad: number
    cedula: string
    barrio: string
    estado_civil: string
    ocupacion: string
    foto_cedula_frente?: File
    foto_cedula_reverso?: File
  }) => {
    setLoading(true)
    try {
      if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        toast.error('❌ Error: Variables de Telegram no configuradas')
        setLoading(false)
        return { success: false }
      }

      const registroId = `${datos.cedula}-${Date.now()}`

      // Crear mensaje con datos del Paso 1
      const mensaje = `
🎪 *NUEVO REGISTRO - PASO 1* 🎪

👤 *Datos Personales:*
Nombre: ${datos.nombre_completo}
Edad: ${datos.edad} años
Cédula: ${datos.cedula}
Barrio: ${datos.barrio}
Estado Civil: ${datos.estado_civil}
Ocupación: ${datos.ocupacion}

ID Registro: \`${registroId}\`

⏳ Esperando Paso 2 (Documentos y foto de rostro)
      `.trim()

      // Enviar mensaje a Telegram
      toast.loading('📤 Enviando datos a Telegram...')
      
      const formData = new FormData()
      formData.append('chat_id', TELEGRAM_CHAT_ID)
      formData.append('text', mensaje)
      formData.append('parse_mode', 'Markdown')

      const response = await fetch(
        `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
        {
          method: 'POST',
          body: formData
        }
      )

      if (!response.ok) {
        toast.error('❌ Error enviando mensaje a Telegram')
        setLoading(false)
        return { success: false }
      }

      // Enviar fotos de cédula si existen
      if (datos.foto_cedula_frente) {
        toast.loading('📤 Enviando foto de cédula (frente)...')
        await enviarFotoTelegram(datos.foto_cedula_frente, '📄 Foto Cédula - Frente')
      }

      if (datos.foto_cedula_reverso) {
        toast.loading('📤 Enviando foto de cédula (reverso)...')
        await enviarFotoTelegram(datos.foto_cedula_reverso, '📄 Foto Cédula - Reverso')
      }

      // Guardar ID en sessionStorage para Paso 2
      sessionStorage.setItem('registroId', registroId)
      sessionStorage.setItem(`cedula-${registroId}`, datos.cedula)

      toast.success('✅ Paso 1 completado correctamente')
      return { success: true, id: registroId }
    } catch (error) {
      console.error('Error en Paso 1:', error)
      toast.error('❌ Error inesperado al procesar el formulario')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return { crear, loading }
}

async function enviarFotoTelegram(archivo: File, caption: string) {
  const formData = new FormData()
  formData.append('chat_id', TELEGRAM_CHAT_ID)
  formData.append('photo', archivo)
  formData.append('caption', caption)
  formData.append('parse_mode', 'Markdown')

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: formData
      }
    )
    return response.ok
  } catch (error) {
    console.error('Error enviando foto:', error)
    return false
  }
}
