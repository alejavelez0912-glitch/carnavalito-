import { createClient } from '@supabase/supabase-js'

// ════════════════════════════════════════════════════════════════
// CONFIGURACIÓN DE SUPABASE
// ════════════════════════════════════════════════════════════════

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    'Variables de entorno VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY no están configuradas'
  )
}

export const supabase = createClient(supabaseUrl, supabaseKey)

// ════════════════════════════════════════════════════════════════
// TIPOS
// ════════════════════════════════════════════════════════════════

export interface RegistroUsuario {
  id?: string
  nombre_completo: string
  edad: number
  cedula: string
  barrio: string
  estado_civil: 'soltero' | 'casado' | 'union_libre'
  ocupacion: 'estudio' | 'trabajo' | 'ambos' | 'ninguno'
  foto_cedula_frente_path?: string
  foto_cedula_reverso_path?: string
  hoja_vida_path?: string
  foto_rostro_path?: string
  estado_registro?: 'paso_1' | 'paso_2' | 'completado' | 'rechazado'
  fecha_creacion?: string
  fecha_actualizacion?: string
  fecha_completado?: string
  ip_direccion?: string
  user_agent?: string
  notas?: string
}

export interface Documento {
  id?: string
  registro_id: string
  tipo_documento: 'cedula_frente' | 'cedula_reverso' | 'hoja_vida' | 'foto_rostro'
  nombre_archivo: string
  ruta_archivo: string
  tamaño_bytes?: number
  tipo_mime?: string
  hash_archivo?: string
  estado?: 'activo' | 'eliminado' | 'verificado'
  fecha_carga?: string
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES PARA REGISTROS
// ════════════════════════════════════════════════════════════════

export const registrosService = {
  /**
   * Crear un nuevo registro
   */
  async crear(datos: RegistroUsuario) {
    try {
      const { data, error } = await supabase
        .from('registros_usuarios')
        .insert([datos])
        .select()

      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al crear registro:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener un registro por ID
   */
  async obtenerPorId(id: string) {
    try {
      const { data, error } = await supabase
        .from('registros_usuarios')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener registro:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener un registro por cédula
   */
  async obtenerPorCedula(cedula: string) {
    try {
      const { data, error } = await supabase
        .from('registros_usuarios')
        .select('*')
        .eq('cedula', cedula)
        .single()

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = no rows
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener registro por cédula:', error)
      return { success: false, error }
    }
  },

  /**
   * Actualizar un registro
   */
  async actualizar(id: string, datos: Partial<RegistroUsuario>) {
    try {
      const { data, error } = await supabase
        .from('registros_usuarios')
        .update(datos)
        .eq('id', id)
        .select()

      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al actualizar registro:', error)
      return { success: false, error }
    }
  },

  /**
   * Completar un registro (marcar como completado)
   */
  async completar(id: string) {
    try {
      const { data, error } = await supabase.rpc('completar_registro', {
        registro_id: id,
      })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al completar registro:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener todos los registros (con filtros opcionales)
   */
  async obtenerTodos(filtros?: { estado?: string; barrio?: string }) {
    try {
      let query = supabase.from('registros_usuarios').select('*')

      if (filtros?.estado) {
        query = query.eq('estado_registro', filtros.estado)
      }
      if (filtros?.barrio) {
        query = query.eq('barrio', filtros.barrio)
      }

      const { data, error } = await query.order('fecha_creacion', { ascending: false })

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener registros:', error)
      return { success: false, error }
    }
  },

  /**
   * Eliminar un registro
   */
  async eliminar(id: string) {
    try {
      const { error } = await supabase
        .from('registros_usuarios')
        .delete()
        .eq('id', id)

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar registro:', error)
      return { success: false, error }
    }
  },
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES PARA ARCHIVOS/STORAGE
// ════════════════════════════════════════════════════════════════

export const storageService = {
  /**
   * Subir un archivo a un bucket
   */
  async subirArchivo(
    bucket: string,
    archivo: File,
    carpeta: string,
    nombrePersonalizado?: string
  ) {
    try {
      const nombreArchivo = nombrePersonalizado || `${Date.now()}-${archivo.name}`
      const ruta = `${carpeta}/${nombreArchivo}`

      const { error } = await supabase.storage.from(bucket).upload(ruta, archivo)

      if (error) throw error
      return { success: true, ruta }
    } catch (error) {
      console.error('Error al subir archivo:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener URL pública de un archivo
   */
  obtenerUrlPublica(bucket: string, ruta: string) {
    try {
      const { data } = supabase.storage.from(bucket).getPublicUrl(ruta)
      return { success: true, url: data.publicUrl }
    } catch (error) {
      console.error('Error al obtener URL:', error)
      return { success: false, error }
    }
  },

  /**
   * Eliminar un archivo
   */
  async eliminarArchivo(bucket: string, ruta: string) {
    try {
      const { error } = await supabase.storage.from(bucket).remove([ruta])

      if (error) throw error
      return { success: true }
    } catch (error) {
      console.error('Error al eliminar archivo:', error)
      return { success: false, error }
    }
  },

  /**
   * Listar archivos en un bucket
   */
  async listarArchivos(bucket: string, carpeta: string) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(carpeta)

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al listar archivos:', error)
      return { success: false, error }
    }
  },
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES PARA DOCUMENTOS
// ════════════════════════════════════════════════════════════════

export const documentosService = {
  /**
   * Crear un registro de documento
   */
  async crear(documento: Documento) {
    try {
      const { data, error } = await supabase
        .from('documentos')
        .insert([documento])
        .select()

      if (error) throw error
      return { success: true, data: data[0] }
    } catch (error) {
      console.error('Error al crear documento:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener documentos de un registro
   */
  async obtenerPorRegistro(registroId: string) {
    try {
      const { data, error } = await supabase
        .from('documentos')
        .select('*')
        .eq('registro_id', registroId)
        .eq('estado', 'activo')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener documentos:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener documento específico
   */
  async obtenerPorTipo(registroId: string, tipoDocumento: string) {
    try {
      const { data, error } = await supabase
        .from('documentos')
        .select('*')
        .eq('registro_id', registroId)
        .eq('tipo_documento', tipoDocumento)
        .eq('estado', 'activo')
        .single()

      if (error && error.code !== 'PGRST116') throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener documento:', error)
      return { success: false, error }
    }
  },
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES PARA ESTADÍSTICAS
// ════════════════════════════════════════════════════════════════

export const estadisticasService = {
  /**
   * Obtener estadísticas generales
   */
  async obtenerGenerales() {
    try {
      const { data, error } = await supabase
        .from('vista_estadisticas_general')
        .select('*')
        .single()

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener estadísticas:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener estadísticas por barrio
   */
  async obtenerPorBarrio() {
    try {
      const { data, error } = await supabase
        .from('vista_estadisticas_barrio')
        .select('*')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener estadísticas por barrio:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener estadísticas por estado civil
   */
  async obtenerPorEstadoCivil() {
    try {
      const { data, error } = await supabase
        .from('vista_estadisticas_estado_civil')
        .select('*')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener estadísticas por estado civil:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener estadísticas por ocupación
   */
  async obtenerPorOcupacion() {
    try {
      const { data, error } = await supabase
        .from('vista_estadisticas_ocupacion')
        .select('*')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener estadísticas por ocupación:', error)
      return { success: false, error }
    }
  },

  /**
   * Obtener estadísticas por edad
   */
  async obtenerPorEdad() {
    try {
      const { data, error } = await supabase
        .from('vista_estadisticas_edad')
        .select('*')

      if (error) throw error
      return { success: true, data }
    } catch (error) {
      console.error('Error al obtener estadísticas por edad:', error)
      return { success: false, error }
    }
  },
}

// ════════════════════════════════════════════════════════════════
// FUNCIONES AUXILIARES
// ════════════════════════════════════════════════════════════════

/**
 * Validar que una cédula no exista
 */
export async function cedulaExiste(cedula: string): Promise<boolean> {
  const { data } = await registrosService.obtenerPorCedula(cedula)
  return !!data
}

/**
 * Obtener información de meta de un registro
 */
export function obtenerInfoMeta(registro: RegistroUsuario) {
  return {
    ip_direccion: registro.ip_direccion || null,
    user_agent: window.navigator.userAgent || null,
    navegador: getBrowserInfo(),
    dispositivo: getDeviceInfo(),
  }
}

/**
 * Funciones auxiliares para información del dispositivo
 */
function getBrowserInfo() {
  const ua = window.navigator.userAgent
  if (ua.indexOf('Firefox') > -1) return 'Firefox'
  if (ua.indexOf('Chrome') > -1) return 'Chrome'
  if (ua.indexOf('Safari') > -1) return 'Safari'
  if (ua.indexOf('Edge') > -1) return 'Edge'
  return 'Otro'
}

function getDeviceInfo() {
  const ua = window.navigator.userAgent
  if (/mobile/i.test(ua)) return 'Mobile'
  if (/tablet/i.test(ua)) return 'Tablet'
  return 'Desktop'
}
