import { useState } from 'react'
import { registrosService, storageService } from '@/lib/supabase'
import { toast } from 'sonner'

export function useRegistroPaso2() {
  const [loading, setLoading] = useState(false)

  const completar = async (registroId: string, archivos: {
    hojaVida?: File
    fotoRostro?: File
  }) => {
    setLoading(true)
    try {
      if (!registroId) {
        toast.error('❌ Error: No se encontró el registro del Paso 1')
        setLoading(false)
        return { success: false }
      }

      // Obtener cédula del registro
      const cedula = sessionStorage.getItem(`cedula-${registroId}`)
      
      if (!cedula) {
        toast.error('❌ Error: No se encontró la cédula del registro')
        setLoading(false)
        return { success: false }
      }

      // 1. Subir hoja de vida
      let hojaVidaPath = null
      if (archivos.hojaVida) {
        toast.loading('📤 Subiendo hoja de vida...')
        const resultado = await storageService.subirArchivo(
          'documentos',
          archivos.hojaVida,
          registroId,
          'hoja_vida'
        )
        if (resultado.success) {
          hojaVidaPath = resultado.ruta
        } else {
          toast.error('❌ Error subiendo hoja de vida')
          setLoading(false)
          return { success: false }
        }
      }

      // 2. Subir foto de rostro
      let fotoRostroPath = null
      if (archivos.fotoRostro) {
        toast.loading('📤 Subiendo foto de rostro...')
        const resultado = await storageService.subirArchivo(
          'fotos-rostro',
          archivos.fotoRostro,
          registroId,
          'foto_rostro'
        )
        if (resultado.success) {
          fotoRostroPath = resultado.ruta
        } else {
          toast.error('❌ Error subiendo foto de rostro')
          setLoading(false)
          return { success: false }
        }
      }

      // 3. Actualizar registro con rutas de archivos
      toast.loading('💾 Finalizando registro...')
      const actualizarResultado = await registrosService.actualizar(registroId, {
        hoja_vida_path: hojaVidaPath,
        foto_rostro_path: fotoRostroPath
      })

      if (!actualizarResultado.success) {
        toast.error('❌ Error actualizando registro')
        setLoading(false)
        return { success: false }
      }

      // 4. Marcar como completado
      const completarResultado = await registrosService.completar(registroId)

      if (completarResultado.success) {
        // Limpiar sessionStorage
        sessionStorage.removeItem('registroId')
        sessionStorage.removeItem(`cedula-${registroId}`)
        
        toast.success('🎉 ¡Registro completado correctamente!')
        return { success: true }
      } else {
        toast.error('❌ Error completando registro')
        return { success: false }
      }
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
