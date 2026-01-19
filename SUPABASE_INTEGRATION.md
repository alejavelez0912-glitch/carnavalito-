# 🔌 INTEGRACIÓN SUPABASE CON LOS FORMULARIOS

> Guía paso a paso para integrar Supabase en los formularios React

---

## 📋 Tabla de Contenidos

1. [Preparación](#preparación)
2. [Integración Paso 1](#integración-paso-1-datos-personales)
3. [Integración Paso 2](#integración-paso-2-documentos)
4. [Hooks Reutilizables](#hooks-reutilizables)
5. [Manejo de Errores](#manejo-de-errores)
6. [Testing](#testing)

---

## 🔧 Preparación

### 1. Instalar Supabase
```bash
npm install @supabase/supabase-js
```

### 2. Crear archivo de servicio
Ya creado en `src/lib/supabase.ts` ✅

### 3. Crear archivo .env.local
```bash
# Copia .env.example a .env.local
cp .env.example .env.local

# Edita .env.local con tus credenciales
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Ejecutar schema
En Supabase Dashboard:
1. Ve a **SQL Editor**
2. Crea nueva query
3. Copia contenido de `supabase-schema.sql`
4. Ejecuta

---

## 🔗 Integración Paso 1 (Datos Personales)

### Crear Hook para Paso 1

Archivo: `src/hooks/useRegistroPaso1.ts`

```typescript
import { useState } from 'react'
import { registrosService, RegistroUsuario } from '@/lib/supabase'
import { toast } from 'sonner'

export const useRegistroPaso1 = () => {
  const [registroId, setRegistroId] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const crearRegistro = async (datosFormulario: any, fotoFrente: File, fotoReverso: File) => {
    setIsLoading(true)
    try {
      // 1. Validar que la cédula no exista
      const { data: existing } = await registrosService.obtenerPorCedula(
        datosFormulario.cedula
      )

      if (existing) {
        toast.error('Esta cédula ya está registrada')
        return { success: false }
      }

      // 2. Preparar datos del registro
      const datosRegistro: RegistroUsuario = {
        nombre_completo: datosFormulario.nombreCompleto,
        edad: datosFormulario.edad,
        cedula: datosFormulario.cedula,
        barrio: datosFormulario.barrio,
        estado_civil: datosFormulario.estadoCivil,
        ocupacion: datosFormulario.ocupacion,
        estado_registro: 'paso_1',
        user_agent: window.navigator.userAgent,
      }

      // 3. Crear registro en BD
      const { success, data } = await registrosService.crear(datosRegistro)

      if (!success || !data) {
        toast.error('Error al crear el registro')
        return { success: false }
      }

      setRegistroId(data.id)
      toast.success('¡Registro creado! Ahora sube tus documentos.')

      return { success: true, registroId: data.id }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error inesperado. Intenta de nuevo.')
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    registroId,
    isLoading,
    crearRegistro,
  }
}
```

### Actualizar CarnavalForm.tsx

Primero, lee el componente actual:

```typescript
// En CarnavalForm.tsx, reemplazar onSubmit:

import { useRegistroPaso1 } from '@/hooks/useRegistroPaso1'

const CarnavalForm = () => {
  const navigate = useNavigate()
  const { crearRegistro, isLoading } = useRegistroPaso1()
  // ... resto del código ...

  const onSubmit = async (data: FormData) => {
    if (!validatePhotos()) return

    // Validar cédula no exista
    const { success, registroId } = await crearRegistro(data, fotoFrente, fotoReverso)

    if (!success) return

    // Navegar con el ID del registro
    navigate("/registro-documentos", {
      state: {
        ...data,
        fotoFrente,
        fotoReverso,
        registroId, // NUEVO
      },
    })
  }
}
```

---

## 🔗 Integración Paso 2 (Documentos)

### Crear Hook para Paso 2

Archivo: `src/hooks/useRegistroPaso2.ts`

```typescript
import { useState } from 'react'
import { registrosService, storageService, documentosService } from '@/lib/supabase'
import { toast } from 'sonner'

export const useRegistroPaso2 = () => {
  const [isLoading, setIsLoading] = useState(false)

  const completarRegistro = async (
    registroId: string,
    hojaVida: File,
    fotoRostro: File
  ) => {
    setIsLoading(true)
    try {
      // 1. Subir hoja de vida a Storage
      const { success: successHoja, ruta: rutaHoja } = await storageService.subirArchivo(
        'documentos',
        hojaVida,
        registroId,
        `hoja_vida_${Date.now()}.pdf`
      )

      if (!successHoja) {
        toast.error('Error al subir hoja de vida')
        return { success: false }
      }

      // 2. Subir foto de rostro a Storage
      const { success: successFoto, ruta: rutaFoto } = await storageService.subirArchivo(
        'fotos-rostro',
        fotoRostro,
        registroId,
        `foto_rostro_${Date.now()}.jpg`
      )

      if (!successFoto) {
        toast.error('Error al subir foto de rostro')
        return { success: false }
      }

      // 3. Actualizar registro con las rutas
      const { success: successUpdate } = await registrosService.actualizar(registroId, {
        hoja_vida_path: rutaHoja,
        foto_rostro_path: rutaFoto,
        estado_registro: 'paso_2',
      })

      if (!successUpdate) {
        toast.error('Error al actualizar registro')
        return { success: false }
      }

      // 4. Crear registros de documentos
      await documentosService.crear({
        registro_id: registroId,
        tipo_documento: 'hoja_vida',
        nombre_archivo: hojaVida.name,
        ruta_archivo: rutaHoja,
        tamaño_bytes: hojaVida.size,
        tipo_mime: hojaVida.type,
      })

      await documentosService.crear({
        registro_id: registroId,
        tipo_documento: 'foto_rostro',
        nombre_archivo: fotoRostro.name,
        ruta_archivo: rutaFoto,
        tamaño_bytes: fotoRostro.size,
        tipo_mime: fotoRostro.type,
      })

      // 5. Marcar como completado
      const { success: successComplet } = await registrosService.completar(registroId)

      if (!successComplet) {
        toast.error('Error al completar registro')
        return { success: false }
      }

      toast.success('¡Inscripción completada! Gracias por participar.')
      return { success: true }
    } catch (error) {
      console.error('Error:', error)
      toast.error('Error inesperado. Intenta de nuevo.')
      return { success: false }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    completarRegistro,
  }
}
```

### Actualizar RegistroDocumentos.tsx

```typescript
// En RegistroDocumentos.tsx

import { useRegistroPaso2 } from '@/hooks/useRegistroPaso2'

const RegistroDocumentos = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const [hojaVida, setHojaVida] = useState<File | null>(null)
  const [fotoRostro, setFotoRostro] = useState<File | null>(null)
  const [isSuccess, setIsSuccess] = useState(false)
  const { completarRegistro, isLoading } = useRegistroPaso2()

  const step1Data = location.state

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!hojaVida || !fotoRostro) {
      toast.error('Todos los documentos son obligatorios')
      return
    }

    if (!step1Data?.registroId) {
      toast.error('No hay información del paso 1')
      navigate('/')
      return
    }

    // Completar el registro
    const { success } = await completarRegistro(
      step1Data.registroId,
      hojaVida,
      fotoRostro
    )

    if (success) {
      setIsSuccess(true)
      // Mostrar pantalla de éxito por 3 segundos
      setTimeout(() => navigate('/'), 3000)
    }
  }

  // ... resto del componente ...
}
```

---

## 🎣 Hooks Reutilizables

### Hook para Obtener Estadísticas

Archivo: `src/hooks/useEstadisticas.ts`

```typescript
import { useEffect, useState } from 'react'
import { estadisticasService } from '@/lib/supabase'

export const useEstadisticas = () => {
  const [estadisticas, setEstadisticas] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarEstadisticas = async () => {
      try {
        const { success, data } = await estadisticasService.obtenerGenerales()
        if (success) setEstadisticas(data)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    cargarEstadisticas()
  }, [])

  return { estadisticas, loading }
}
```

### Hook para Validar Cédula

Archivo: `src/hooks/useCedulaValida.ts`

```typescript
import { useState } from 'react'
import { registrosService } from '@/lib/supabase'

export const useCedulaValida = () => {
  const [existe, setExiste] = useState(false)
  const [validando, setValidando] = useState(false)

  const validar = async (cedula: string) => {
    setValidando(true)
    try {
      const { data } = await registrosService.obtenerPorCedula(cedula)
      setExiste(!!data)
      return !data
    } finally {
      setValidando(false)
    }
  }

  return { existe, validando, validar }
}
```

---

## 🛡️ Manejo de Errores

### Crear Archivo de Errores

Archivo: `src/lib/errors.ts`

```typescript
export const errorMessages: Record<string, string> = {
  // Supabase errors
  'PGRST001': 'Error de autenticación',
  'PGRST116': 'Registro no encontrado',
  'PGRST201': 'Error al crear registro',
  'PGRST202': 'Error al actualizar registro',
  'PGRST203': 'Error al eliminar registro',
  
  // Validation errors
  'CEDULA_DUPLICADA': 'Esta cédula ya está registrada',
  'CEDULA_INVALIDA': 'Formato de cédula inválido',
  'EDAD_INVALIDA': 'Debes tener entre 18 y 60 años',
  
  // File errors
  'ARCHIVO_GRANDE': 'Archivo demasiado grande',
  'TIPO_ARCHIVO_INVALIDO': 'Tipo de archivo no permitido',
  'ERROR_SUBIDA': 'Error al subir archivo',
  
  // General errors
  'ERROR_RED': 'Error de conexión. Intenta de nuevo.',
  'ERROR_DESCONOCIDO': 'Error inesperado. Intenta más tarde.',
}

export function obtenerMensajeError(code: string): string {
  return errorMessages[code] || errorMessages['ERROR_DESCONOCIDO']
}
```

---

## 🧪 Testing

### Crear Tests para Servicios

Archivo: `src/lib/__tests__/supabase.test.ts`

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { registrosService } from '@/lib/supabase'

describe('Registros Service', () => {
  let registroId: string

  it('debería crear un registro', async () => {
    const { success, data } = await registrosService.crear({
      nombre_completo: 'Test Usuario',
      edad: 25,
      cedula: '999999999',
      barrio: 'Test Barrio',
      estado_civil: 'soltero',
      ocupacion: 'trabajo',
    })

    expect(success).toBe(true)
    expect(data).toBeDefined()
    registroId = data.id
  })

  it('debería obtener un registro por ID', async () => {
    const { success, data } = await registrosService.obtenerPorId(registroId)

    expect(success).toBe(true)
    expect(data.nombre_completo).toBe('Test Usuario')
  })

  it('debería detectar cédula duplicada', async () => {
    const { success, data } = await registrosService.obtenerPorCedula('999999999')

    expect(success).toBe(true)
    expect(data).toBeDefined()
  })

  it('debería actualizar un registro', async () => {
    const { success } = await registrosService.actualizar(registroId, {
      barrio: 'Nuevo Barrio',
    })

    expect(success).toBe(true)
  })

  it('debería eliminar un registro', async () => {
    const { success } = await registrosService.eliminar(registroId)

    expect(success).toBe(true)
  })
})
```

---

## 📝 Checklist de Integración

```
□ Instalar @supabase/supabase-js
□ Crear archivo src/lib/supabase.ts
□ Crear .env.local con credenciales
□ Ejecutar supabase-schema.sql
□ Crear buckets en Storage
□ Crear hook useRegistroPaso1
□ Crear hook useRegistroPaso2
□ Integrar en CarnavalForm.tsx
□ Integrar en RegistroDocumentos.tsx
□ Crear hooks de estadísticas
□ Agregar manejo de errores
□ Crear tests
□ Probar en desarrollo
```

---

## 🚀 Pruebas en Desarrollo

### Test Local

1. Inicia el servidor: `npm run dev`
2. Abre http://localhost:8080
3. Completa formulario Paso 1
4. Verifica en Supabase Dashboard → Table Editor que se creó el registro
5. Completa formulario Paso 2
6. Verifica que se subieron los archivos en Storage
7. Verifica que se actualizo el registro a "completado"

### Test de Archivos

1. Ve a Supabase Dashboard → Storage
2. Verifica que los archivos están en los buckets correctos
3. Descarga un archivo para confirmar que se subió bien

### Test de Estadísticas

1. En consola del navegador:
```javascript
import { estadisticasService } from '@/lib/supabase'

await estadisticasService.obtenerGenerales()
// Debería devolver estadísticas actualizadas
```

---

## 🐛 Debugging

### Ver Logs de Supabase

En Supabase Dashboard → Logs:
```
1. Database Logs - Ver queries SQL
2. Auth Logs - Ver eventos de autenticación
3. Edge Functions Logs - Si usas functions
```

### Habilitar Debug en Cliente

```typescript
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
  // Habilitar logs en desarrollo
  debug: import.meta.env.DEV,
})
```

---

## 📚 Próximos Pasos

1. ✅ Crear servicios Supabase
2. ✅ Integrar en formularios
3. ⏳ Crear dashboard de administración
4. ⏳ Agregar rol de admin
5. ⏳ Crear reportes
6. ⏳ Implementar notificaciones por email

---

**Estado:** Listo para integración 🚀
