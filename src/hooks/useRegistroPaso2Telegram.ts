import { useState } from 'react'
import { toast } from 'sonner'

const TELEGRAM_BOT_TOKEN = import.meta.env.VITE_TELEGRAM_BOT_TOKEN || ''
const TELEGRAM_CHAT_ID = import.meta.env.VITE_TELEGRAM_CHAT_ID || ''

export function useRegistroPaso2Telegram() {
  const [loading, setLoading] = useState(false)

  const completar = async (registroId: string, archivos: {
    hojaVida?: File
    fotoRostro?: File
  }) => {
    setLoading(true)
    try {
      if (!TELEGRAM_BOT_TOKEN) {
        toast.error('❌ Error: VITE_TELEGRAM_BOT_TOKEN no está configurado en .env.local')
        setLoading(false)
        return { success: false }
      }
      
      if (!TELEGRAM_CHAT_ID) {
        toast.error('❌ Error: VITE_TELEGRAM_CHAT_ID no está configurado. Por favor, obtén tu Chat ID y agrégalo a .env.local', {
          duration: 8000,
          action: {
            label: 'Ver instrucciones',
            onClick: () => window.open('/telegram-helper.html', '_blank')
          }
        })
        setLoading(false)
        return { success: false }
      }

      if (!registroId) {
        toast.error('❌ Error: No se encontró el registro del Paso 1')
        setLoading(false)
        return { success: false }
      }

      const cedula = sessionStorage.getItem(`cedula-${registroId}`)
      if (!cedula) {
        toast.error('❌ Error: No se encontró la cédula del registro')
        setLoading(false)
        return { success: false }
      }

      // Crear mensaje de Paso 2
      const mensaje = `
✅ *PASO 2 COMPLETADO* ✅

ID Registro: \`${registroId}\`
Cédula: ${cedula}

📎 *Documentos Enviados:*
${archivos.hojaVida ? '✓ Hoja de Vida' : '✗ Hoja de Vida'}
${archivos.fotoRostro ? '✓ Foto de Rostro' : '✗ Foto de Rostro'}

🎉 *REGISTRO FINALIZADO*
      `.trim()

      // Enviar mensaje de confirmación
      toast.loading('📤 Enviando confirmación a Telegram...')
      
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
        const errorData = await response.json().catch(() => ({}))
        console.error('Error de Telegram API:', errorData)
        toast.error(`❌ Error enviando mensaje a Telegram: ${errorData.description || 'Error desconocido'}`)
        setLoading(false)
        return { success: false }
      }

      const result = await response.json()
      toast.dismiss() // Cerrar toast de loading

      // Enviar documentos si existen
      if (archivos.hojaVida) {
        toast.loading('📤 Enviando hoja de vida...')
        const documentoEnviado = await enviarDocumentoTelegram(archivos.hojaVida, '📄 Hoja de Vida')
        if (!documentoEnviado) {
          toast.warning('⚠️ No se pudo enviar la hoja de vida, pero el registro se completó')
        }
      }

      if (archivos.fotoRostro) {
        toast.loading('📤 Enviando foto de rostro...')
        const fotoEnviada = await enviarFotoTelegram(archivos.fotoRostro, '📷 Foto de Rostro')
        if (!fotoEnviada) {
          toast.warning('⚠️ No se pudo enviar la foto de rostro, pero el registro se completó')
        }
      }

      // Limpiar sessionStorage
      sessionStorage.removeItem('registroId')
      sessionStorage.removeItem(`cedula-${registroId}`)

      toast.success('🎉 ¡Registro completado correctamente!')
      return { success: true }
    } catch (error) {
      console.error('Error en Paso 2:', error)
      toast.error('❌ Error inesperado al procesar el formulario')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return { completar, loading }
}

async function enviarFotoTelegram(archivo: File, caption: string) {
  const formData = new FormData()
  formData.append('chat_id', TELEGRAM_CHAT_ID)
  formData.append('photo', archivo)
  formData.append('caption', caption)

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendPhoto`,
      {
        method: 'POST',
        body: formData
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error enviando foto a Telegram:', errorData)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error enviando foto:', error)
    return false
  }
}

async function enviarDocumentoTelegram(archivo: File, caption: string) {
  const formData = new FormData()
  formData.append('chat_id', TELEGRAM_CHAT_ID)
  formData.append('document', archivo)
  formData.append('caption', caption)

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument`,
      {
        method: 'POST',
        body: formData
      }
    )
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      console.error('Error enviando documento a Telegram:', errorData)
      return false
    }
    
    return true
  } catch (error) {
    console.error('Error enviando documento:', error)
    return false
  }
}
