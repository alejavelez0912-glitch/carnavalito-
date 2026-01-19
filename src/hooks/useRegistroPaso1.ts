import { useState } from 'react'
import { registrosService, storageService, cedulaExiste } from '@/lib/supabase'
import { toast } from 'sonner'

export function useRegistroPaso1() {
  const [loading, setLoading] = useState(false)
  const [registro, setRegistro] = useState<any>(null)

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
      // 1. Validar que cédula no exista
      const existente = await cedulaExiste(datos.cedula)
      if (existente) {
        toast.error('❌ Cédula ya está registrada en el sistema')
        setLoading(false)
        return { success: false }
      }

      // 2. Subir fotos de cédula si existen
      let fotoCedulaFrentePath = null
      let fotoCedulaReversePath = null

      if (datos.foto_cedula_frente) {
        toast.loading('📤 Subiendo foto de cédula frente...')
        const resultadoFrente = await storageService.subirArchivo(
          'cedulas',
          datos.foto_cedula_frente,
          datos.cedula,
          'cedula_frente'
        )
        if (resultadoFrente.success) {
          fotoCedulaFrentePath = resultadoFrente.ruta
        } else {
          toast.error('❌ Error subiendo foto frente')
          setLoading(false)
          return { success: false }
        }
      }

      if (datos.foto_cedula_reverso) {
        toast.loading('📤 Subiendo foto de cédula reverso...')
        const resultadoReverso = await storageService.subirArchivo(
          'cedulas',
          datos.foto_cedula_reverso,
          datos.cedula,
          'cedula_reverso'
        )
        if (resultadoReverso.success) {
          fotoCedulaReversePath = resultadoReverso.ruta
        } else {
          toast.error('❌ Error subiendo foto reverso')
          setLoading(false)
          return { success: false }
        }
      }

      // 3. Crear registro en BD
      toast.loading('💾 Guardando datos en la base de datos...')
      const resultado = await registrosService.crear({
        nombre_completo: datos.nombre_completo,
        edad: datos.edad,
        cedula: datos.cedula,
        barrio: datos.barrio,
        estado_civil: datos.estado_civil as 'soltero' | 'casado' | 'union_libre',
        ocupacion: datos.ocupacion as 'estudio' | 'trabajo' | 'ambos' | 'ninguno',
        foto_cedula_frente_path: fotoCedulaFrentePath,
        foto_cedula_reverso_path: fotoCedulaReversePath,
        estado_registro: 'paso_1'
      })

      if (resultado.success) {
        setRegistro(resultado.data)
        
        // Guardar ID en sessionStorage para Paso 2
        sessionStorage.setItem('registroId', resultado.data.id)
        sessionStorage.setItem(`cedula-${resultado.data.id}`, datos.cedula)
        
        toast.success('✅ Paso 1 completado correctamente')
        return { success: true, id: resultado.data.id }
      } else {
        toast.error(`❌ Error: ${resultado.error || 'No se pudo crear el registro'}`)
        return { success: false }
      }
    } catch (error) {
      console.error('Error en Paso 1:', error)
      toast.error('❌ Error inesperado al procesar el formulario')
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return { crear, loading, registro }
}
