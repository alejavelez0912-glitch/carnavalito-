# ⚡ COMANDOS RÁPIDOS SUPABASE

> Referencia rápida de comandos SQL y TypeScript para Supabase

---

## 🔍 CONSULTAS SQL ÚTILES

### Estadísticas Generales

```sql
-- Ver todos los registros
SELECT * FROM registros_usuarios ORDER BY fecha_creacion DESC;

-- Contar registros por estado
SELECT estado_registro, COUNT(*) FROM registros_usuarios GROUP BY estado_registro;

-- Registros completados esta semana
SELECT * FROM registros_usuarios 
WHERE estado_registro = 'completado' 
AND fecha_completado >= NOW() - INTERVAL '7 days';

-- Promedio de edad por barrio
SELECT barrio, AVG(edad) as edad_promedio, COUNT(*) as total
FROM registros_usuarios
GROUP BY barrio
ORDER BY total DESC;

-- Distribución por ocupación
SELECT ocupacion, COUNT(*) as total, 
       ROUND(COUNT(*)*100.0/(SELECT COUNT(*) FROM registros_usuarios), 2) as porcentaje
FROM registros_usuarios
GROUP BY ocupacion;

-- Encontrar cédulas duplicadas
SELECT cedula, COUNT(*) as repetidas
FROM registros_usuarios
GROUP BY cedula
HAVING COUNT(*) > 1;

-- Registros sin documentos completos
SELECT * FROM registros_usuarios
WHERE hoja_vida_path IS NULL OR foto_rostro_path IS NULL;

-- Ver auditoría de un registro
SELECT * FROM auditoria_registros
WHERE registro_id = 'uuid-aqui'
ORDER BY fecha DESC;
```

---

## 📝 OPERACIONES CRUD (TypeScript)

### CREATE (Crear)

```typescript
// Importar servicios
import { registrosService } from '@/lib/supabase'

// Crear nuevo registro
const resultado = await registrosService.crear({
  nombre_completo: 'Carlos López',
  edad: 30,
  cedula: '456789012',
  barrio: 'Rebolo',
  estado_civil: 'casado',
  ocupacion: 'trabajo'
})

if (resultado.success) {
  console.log('ID del nuevo registro:', resultado.data.id)
}
```

### READ (Leer)

```typescript
// Por ID
const { data } = await registrosService.obtenerPorId('uuid-aqui')

// Por cédula
const { data } = await registrosService.obtenerPorCedula('456789012')

// Todos (con filtros opcionales)
const { data } = await registrosService.obtenerTodos({
  estado: 'completado',
  barrio: 'San José'
})
```

### UPDATE (Actualizar)

```typescript
// Actualizar campos
const { success } = await registrosService.actualizar('uuid-aqui', {
  barrio: 'Nuevo barrio',
  notas: 'Revisado manualmente',
  estado_registro: 'rechazado'
})
```

### DELETE (Eliminar)

```typescript
// Eliminar registro (cascada: también documentos)
const { success } = await registrosService.eliminar('uuid-aqui')
```

---

## 📤 OPERACIONES DE ARCHIVOS

### Subir

```typescript
import { storageService } from '@/lib/supabase'

// Subir archivo
const { success, ruta } = await storageService.subirArchivo(
  'documentos',           // bucket
  archivoFile,           // File object
  'usuario-123456789',   // carpeta
  'hoja_vida.pdf'        // nombre (opcional)
)

if (success) {
  console.log('URL de almacenamiento:', ruta)
  // Guardar ruta en registro
}
```

### Obtener URL Pública

```typescript
// Generar URL pública para mostrar archivo
const { url } = storageService.obtenerUrlPublica('cedulas', 'usuario-123/cedula_frente.jpg')

// Usar en <img> tag
<img src={url} alt="Cedula frente" />
```

### Eliminar

```typescript
// Eliminar archivo de Storage
const { success } = await storageService.eliminarArchivo(
  'documentos',
  'usuario-123/hoja_vida.pdf'
)
```

### Listar

```typescript
// Ver archivos en carpeta
const { data: archivos } = await storageService.listarArchivos(
  'documentos',
  'usuario-123'
)

// archivos es array de { name, id, updated_at, metadata }
archivos.forEach(archivo => {
  console.log(archivo.name)
})
```

---

## 📊 ESTADÍSTICAS Y REPORTES

### General

```typescript
import { estadisticasService } from '@/lib/supabase'

const { data } = await estadisticasService.obtenerGenerales()
// Retorna:
// {
//   registros_en_paso_1: 45,
//   registros_en_paso_2: 23,
//   registros_completados: 120,
//   registros_rechazados: 5,
//   total_registros: 193,
//   tasa_completacion_porcentaje: 62.17,
//   primer_registro: '2026-01-16T10:00:00Z',
//   ultimo_registro: '2026-01-19T15:30:00Z'
// }
```

### Por Barrio

```typescript
const { data: barrios } = await estadisticasService.obtenerPorBarrio()
// Retorna array:
// [
//   {
//     barrio: 'San José',
//     total_registros: 45,
//     completados: 38,
//     porcentaje_completacion: 84.44
//   },
//   ...
// ]
```

### Por Edad

```typescript
const { data: edades } = await estadisticasService.obtenerPorEdad()
// Retorna array:
// [
//   {
//     rango_edad: '18-25',
//     total_registros: 52,
//     edad_promedio: 21.5,
//     completados: 43
//   },
//   ...
// ]
```

### Por Ocupación

```typescript
const { data: ocupaciones } = await estadisticasService.obtenerPorOcupacion()
```

### Por Estado Civil

```typescript
const { data: estados } = await estadisticasService.obtenerPorEstadoCivil()
```

---

## 🔐 FUNCIONES ESPECIALES

### Completar Registro

```typescript
// Marca como 'completado', actualiza fecha, registra en auditoría
const { success } = await registrosService.completar('uuid-aqui')
```

### Validar Cédula Única

```typescript
import { cedulaExiste } from '@/lib/supabase'

const existe = await cedulaExiste('456789012')
if (existe) {
  console.log('Cédula ya registrada')
} else {
  console.log('Cédula disponible')
}
```

### Información del Dispositivo

```typescript
import { obtenerInfoMeta } from '@/lib/supabase'

const meta = obtenerInfoMeta(registro)
// Retorna:
// {
//   ip_direccion: null,
//   user_agent: 'Mozilla/5.0...',
//   navegador: 'Chrome',
//   dispositivo: 'Mobile'
// }
```

---

## 🔄 TRANSACCIONES Y ATÓMICAS

### Crear + Subir + Registrar Documento (TODO: Implementar)

```typescript
// Idealmente en una función transaccional:

async function registrarConDocumentos(datos, archivos) {
  // 1. Crear registro
  const registro = await registrosService.crear(datos)
  
  // 2. Subir archivos
  const ruta1 = await storageService.subirArchivo(...)
  const ruta2 = await storageService.subirArchivo(...)
  
  // 3. Actualizar con rutas
  await registrosService.actualizar(registro.id, {
    foto_cedula_frente_path: ruta1,
    foto_cedula_reverso_path: ruta2
  })
  
  // 4. Registrar documentos
  await documentosService.crear({...})
  
  // Si algo falla en el medio, la BD queda en estado inconsistente
  // Solución: Usar transacciones de Supabase (en desarrollo)
}
```

---

## 🛠️ UTILIDADES FRECUENTES

### Formatear Fecha

```typescript
import { format } from 'date-fns'

const fechaFormato = format(new Date(registro.fecha_creacion), 'dd/MM/yyyy HH:mm')
console.log(fechaFormato) // 19/01/2026 15:30
```

### Filtros Dinámicos

```typescript
// Construir filtro dinámicamente
async function filtrarRegistros(criterios: {
  estado?: string
  barrio?: string
  edadMin?: number
  edadMax?: number
}) {
  let query = supabase.from('registros_usuarios').select('*')
  
  if (criterios.estado) query = query.eq('estado_registro', criterios.estado)
  if (criterios.barrio) query = query.eq('barrio', criterios.barrio)
  if (criterios.edadMin) query = query.gte('edad', criterios.edadMin)
  if (criterios.edadMax) query = query.lte('edad', criterios.edadMax)
  
  return await query
}
```

### Paginación

```typescript
const pageSize = 10
const page = 0

const { data } = await supabase
  .from('registros_usuarios')
  .select('*')
  .range(page * pageSize, (page + 1) * pageSize - 1)
  .order('fecha_creacion', { ascending: false })
```

### Búsqueda Full-Text (PostgreSQL)

```typescript
// Buscar nombre o barrio
const busqueda = 'juan'

const { data } = await supabase
  .from('registros_usuarios')
  .select('*')
  .or(`nombre_completo.ilike.%${busqueda}%,barrio.ilike.%${busqueda}%`)
```

---

## 📋 AUDITORÍA

### Ver Cambios en un Registro

```typescript
const { data: historial } = await supabase
  .from('auditoria_registros')
  .select('*')
  .eq('registro_id', 'uuid-aqui')
  .order('fecha', { ascending: false })

historial.forEach(evento => {
  console.log(`${evento.accion} - ${evento.campo_modificado}: ${evento.valor_anterior} → ${evento.valor_nuevo}`)
})
```

### Registrar Evento Manual

```typescript
const { error } = await supabase
  .from('auditoria_registros')
  .insert({
    registro_id: 'uuid-aqui',
    accion: 'rechazado',
    razon: 'Documentos ilegibles',
    usuario_id: 'admin-uuid'
  })
```

---

## 🔗 REFERENCIAS CRUZADAS

### Obtener Documentos de un Registro

```typescript
const { data: docs } = await documentosService.obtenerPorRegistro('uuid-aqui')

docs.forEach(doc => {
  const url = storageService.obtenerUrlPublica(
    getBucketFromType(doc.tipo_documento),
    doc.ruta_archivo
  )
  console.log(`${doc.tipo_documento}: ${url}`)
})
```

### Obtener Validaciones

```typescript
const { data: validaciones } = await supabase
  .from('validaciones_registro')
  .select('*')
  .eq('registro_id', 'uuid-aqui')

// Ver qué validaciones pasaron y cuáles no
validaciones.forEach(v => {
  console.log(`${v.tipo_validacion}: ${v.estado_validacion}`)
})
```

---

## 🚨 MANEJO DE ERRORES

### Try-Catch

```typescript
try {
  const resultado = await registrosService.crear(datos)
  
  if (!resultado.success) {
    console.error('Error:', resultado.error)
    // Mostrar toast error
    return
  }
  
  console.log('Creado:', resultado.data.id)
  // Mostrar toast success
  
} catch (error) {
  console.error('Error no esperado:', error)
  // Mostrar toast genérico
}
```

### Errores Comunes

```typescript
// Cédula duplicada
const { data: existing } = await registrosService.obtenerPorCedula('123')
if (existing) {
  // Toast: "Cédula ya está registrada"
}

// Archivo demasiado grande (5MB limit recomendado)
if (archivo.size > 5 * 1024 * 1024) {
  // Toast: "Archivo muy grande (máx 5MB)"
}

// Bucket no encontrado
try {
  await storageService.subirArchivo('bucket-inexistente', archivo, 'ruta')
} catch (error) {
  // Toast: "Error de configuración de storage"
}

// No conectado a BD
if (!supabase) {
  // Toast: "No hay conexión a la base de datos"
}
```

---

## 📱 EN DESARROLLO

```bash
# Instalar dependencias
npm install

# Iniciar servidor
npm run dev

# Ver logs de Supabase
# Dashboard → Logs → Database/Auth Logs

# Ejecutar tests
npm run test

# Build para producción
npm run build
```

---

## 🚀 DEPLOY A PRODUCCIÓN

```bash
# Build
npm run build

# Verificar que las variables de entorno están configuradas
# VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY

# Subir a tu hosting (Vercel, Netlify, etc.)
# Las variables de entorno se configuran en el panel del hosting
```

---

**Referencia rápida lista para copiar y pegar** 📋
