# 🗄️ GUÍA DE CONFIGURACIÓN SUPABASE

> Configuración paso a paso de la base de datos en Supabase

---

## 📋 Tabla de Contenidos

1. [Crear Proyecto Supabase](#crear-proyecto-supabase)
2. [Importar Schema](#importar-schema)
3. [Configurar Storage](#configurar-storage)
4. [Configurar Autenticación](#configurar-autenticación)
5. [Integración con React](#integración-con-react)
6. [Variables de Entorno](#variables-de-entorno)
7. [Conexión desde la App](#conexión-desde-la-app)
8. [Operaciones CRUD](#operaciones-crud)

---

## 🚀 Crear Proyecto Supabase

### Paso 1: Crear Cuenta
1. Ir a [supabase.com](https://supabase.com)
2. Hacer clic en "Start your project"
3. Registrarse con GitHub o email

### Paso 2: Crear Nuevo Proyecto
1. En el dashboard, hacer clic en "New Project"
2. Llenar datos:
   - **Project name:** `carnaval-jobs-db`
   - **Database password:** Crear contraseña segura
   - **Region:** Seleccionar la más cercana
   - **Pricing plan:** Free (o Pro según necesites)
3. Esperar a que se cree (toma unos minutos)

### Paso 3: Obtener Credenciales
Una vez creado, ir a **Settings → API** y copiar:
- `Project URL`
- `Public API Key (anon)`
- `Service Role Secret` (guardar seguro)

---

## 📊 Importar Schema

### Opción A: Via SQL Editor (Recomendado)

1. En Supabase, ir a **SQL Editor**
2. Hacer clic en "New Query"
3. Copiar todo el contenido de `supabase-schema.sql`
4. Pegar en el editor
5. Hacer clic en "Run"

✅ Las tablas, índices y vistas se crearán automáticamente

### Opción B: Via CLI (Alternativa)

```bash
# Instalar Supabase CLI
npm install -g supabase

# Inicializar proyecto local
supabase init

# Conectar con proyecto remoto
supabase link --project-ref tu-project-ref

# Ejecutar migrations
psql -h db.tu-project-ref.supabase.co -U postgres < supabase-schema.sql
```

---

## 💾 Configurar Storage

Supabase necesita buckets para guardar archivos (fotos, documentos).

### Crear Buckets

En Supabase dashboard, ir a **Storage → Buckets** y crear:

#### 1. Bucket para Cédulas
```
Nombre: cedulas
Privacidad: Private
Campos personalizados: No
```

#### 2. Bucket para Documentos
```
Nombre: documentos
Privacidad: Private
Campos personalizados: No
```

#### 3. Bucket para Fotos de Rostro
```
Nombre: fotos-rostro
Privacidad: Private
Campos personalizados: No
```

### Configurar Políticas de Acceso

Para cada bucket, en **Policies** añadir:

```sql
-- Permitir lectura a usuarios autenticados
CREATE POLICY "Leer propios documentos" ON storage.objects
  FOR SELECT
  USING (auth.uid() IS NOT NULL);

-- Permitir escritura a usuarios autenticados
CREATE POLICY "Subir propios documentos" ON storage.objects
  FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);
```

---

## 🔐 Configurar Autenticación

### En Supabase Dashboard

1. Ir a **Authentication → Providers**
2. Habilitar:
   - ✅ Email (por defecto)
   - ✅ Anonymous (si deseas)

### Configurar Email

1. **Authentication → Email Templates**
2. Customizar si lo deseas (confirmación, reset, etc.)

---

## 🔌 Integración con React

### Instalar Supabase Client

```bash
npm install @supabase/supabase-js
```

### Crear Cliente en React

Crear archivo `src/lib/supabase.ts`:

```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY

export const supabase = createClient(supabaseUrl, supabaseKey)

export type Database = any // Generar tipos si lo deseas
```

---

## 🔑 Variables de Entorno

Crear archivo `.env.local` en la raíz del proyecto:

```env
# Supabase
VITE_SUPABASE_URL=https://tu-proyecto.supabase.co
VITE_SUPABASE_ANON_KEY=tu-clave-anonima
```

**⚠️ IMPORTANTE:**
- Nunca commits `.env.local`
- La ANON_KEY es pública, se usa en cliente
- El SERVICE_ROLE_SECRET nunca va en cliente

---

## 🔗 Conexión desde la App

### Crear Hook Reutilizable

Crear `src/hooks/useSupabase.ts`:

```typescript
import { useCallback } from 'react'
import { supabase } from '@/lib/supabase'

export const useSupabase = () => {
  const insertarRegistro = useCallback(async (datos: any) => {
    const { data, error } = await supabase
      .from('registros_usuarios')
      .insert([datos])
      .select()
    
    if (error) throw error
    return data
  }, [])

  const actualizarRegistro = useCallback(async (id: string, datos: any) => {
    const { data, error } = await supabase
      .from('registros_usuarios')
      .update(datos)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data
  }, [])

  const obtenerRegistro = useCallback(async (id: string) => {
    const { data, error } = await supabase
      .from('registros_usuarios')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data
  }, [])

  return { insertarRegistro, actualizarRegistro, obtenerRegistro }
}
```

---

## 📝 Operaciones CRUD

### Create (Insertar)

```typescript
const { data, error } = await supabase
  .from('registros_usuarios')
  .insert([
    {
      nombre_completo: 'Juan Pérez',
      edad: 28,
      cedula: '123456789',
      barrio: 'San José',
      estado_civil: 'soltero',
      ocupacion: 'trabajo'
    }
  ])
  .select()

if (error) console.error('Error:', error)
else console.log('Registrado:', data)
```

### Read (Leer)

```typescript
// Obtener un registro
const { data, error } = await supabase
  .from('registros_usuarios')
  .select('*')
  .eq('id', 'uuid-del-registro')
  .single()

// Obtener múltiples registros
const { data, error } = await supabase
  .from('registros_usuarios')
  .select('*')
  .eq('estado_registro', 'completado')

// Con filtros complejos
const { data, error } = await supabase
  .from('registros_usuarios')
  .select('*')
  .eq('estado_registro', 'completado')
  .gte('edad', 25)
  .lte('edad', 35)
```

### Update (Actualizar)

```typescript
const { data, error } = await supabase
  .from('registros_usuarios')
  .update({
    estado_registro: 'paso_2',
    hoja_vida_path: 'usuarios/123/hoja_vida.pdf'
  })
  .eq('id', 'uuid-del-registro')
  .select()
```

### Delete (Eliminar)

```typescript
const { data, error } = await supabase
  .from('registros_usuarios')
  .delete()
  .eq('id', 'uuid-del-registro')
```

---

## 📤 Subir Archivos

### Función para Subir Fotos

```typescript
export const subirFoto = async (
  bucket: string,
  archivo: File,
  carpeta: string
) => {
  const nombreArchivo = `${Date.now()}-${archivo.name}`
  const ruta = `${carpeta}/${nombreArchivo}`

  const { error } = await supabase.storage
    .from(bucket)
    .upload(ruta, archivo)

  if (error) throw error
  return ruta
}
```

### Obtener URL Pública

```typescript
export const obtenerUrlPublica = (bucket: string, ruta: string) => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(ruta)

  return data.publicUrl
}
```

### Uso en Formulario

```typescript
const handleCargaFoto = async (archivo: File) => {
  try {
    const ruta = await subirFoto('cedulas', archivo, `usuario-${cedula}`)
    
    // Actualizar registro con la ruta
    await actualizarRegistro(registroId, {
      foto_cedula_frente_path: ruta
    })
  } catch (error) {
    console.error('Error al subir:', error)
  }
}
```

---

## 📊 Consultar Vistas

Las vistas creadas en el schema te permiten análisis en tiempo real:

```typescript
// Obtener estadísticas generales
const { data: stats } = await supabase
  .from('vista_estadisticas_general')
  .select('*')

// Estadísticas por barrio
const { data: barrios } = await supabase
  .from('vista_estadisticas_barrio')
  .select('*')

// Estadísticas por rango de edad
const { data: edades } = await supabase
  .from('vista_estadisticas_edad')
  .select('*')
```

---

## 🔍 Monitorear en Dashboard

En Supabase Dashboard puedes ver:

### Database
- **Table Editor:** Ver y editar datos
- **SQL Editor:** Ejecutar queries
- **Logs:** Ver errores y queries

### Storage
- Ver archivos subidos
- Descargar
- Deletear si necesario

### Analytics
- Requests
- Queries
- Storage usage

---

## 🛡️ Seguridad

### Mejores Prácticas

1. **Nunca expongas SERVICE_ROLE_SECRET**
   ```
   ✅ Usar en backend/servidor
   ❌ Nunca en cliente
   ```

2. **Usa RLS (Row Level Security)**
   - Ya habilitado en el schema
   - Los usuarios solo ven sus propios datos

3. **Valida en Backend**
   - Supabase valida constraints
   - Pero valida también en cliente

4. **Limpia datos sensibles**
   ```typescript
   // ❌ No guardes contraseñas
   // ❌ No guardes tokens sin encriptar
   ```

---

## ⚠️ Limitaciones Free Tier

| Feature | Free | Pro |
|---------|------|-----|
| Storage | 1GB | Pagado |
| DB Size | 500MB | Pagado |
| Queries | Ilimitadas | Ilimitadas |
| Real-time | Ilimitado | Ilimitado |
| Auth | Ilimitado | Ilimitado |

Para el desarrollo inicial, Free es suficiente.

---

## 🚨 Troubleshooting

### Error: "Cannot find module '@supabase/supabase-js'"
```bash
npm install @supabase/supabase-js
```

### Error: "Invalid URL"
Verifica que VITE_SUPABASE_URL sea correcto en .env.local

### Error: "Invalid API Key"
Verifica que VITE_SUPABASE_ANON_KEY sea la correcta

### Archivos no suben
- Verifica bucket existe
- Verifica políticas de acceso
- Verifica tamaño de archivo

### No puedo ver datos
- Verifica RLS policies
- Verifica permisos del usuario
- Usa SQL Editor para verificar

---

## 📚 Recursos

- [Supabase Docs](https://supabase.com/docs)
- [Supabase JS Client](https://supabase.com/docs/reference/javascript/introduction)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Storage Docs](https://supabase.com/docs/guides/storage)

---

**Próximo paso:** Integrar estas funciones en el formulario de React.
