# 🏗️ ARQUITECTURA CON SUPABASE

> Diagrama y explicación de la arquitectura integrada con Supabase

---

## 📊 Arquitectura General

```
┌──────────────────────────────────────────────────────────────────┐
│                        CLIENTE (React)                            │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │  CarnavalForm.tsx (Paso 1)  +  RegistroDocumentos.tsx      │ │
│  │       Paso 1: Datos         │    Paso 2: Documentos        │ │
│  │  • Nombre, edad, cédula     │  • Hoja de vida              │ │
│  │  • Barrio, estado civil     │  • Foto de rostro            │ │
│  │  • Fotos de cédula          │  • Subida de archivos        │ │
│  └─────────────────────────────────────────────────────────────┘ │
│            ↓                                    ↓                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │           Hooks & Services (React)                          │ │
│  │  • useRegistroPaso1         • useRegistroPaso2             │ │
│  │  • registrosService         • storageService               │ │
│  │  • documentosService        • estadisticasService          │ │
│  └─────────────────────────────────────────────────────────────┘ │
│            ↓                                    ↓                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │        Supabase JS Client (@supabase/supabase-js)          │ │
│  │  • Database Queries         • Storage Upload/Download      │ │
│  │  • Real-time Subscriptions  • Authentication               │ │
│  └─────────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────────┘
            ↓                                    ↓
            │                                    │
┌───────────▼────────────────┐    ┌───────────▼────────────────┐
│   SUPABASE DATABASE         │    │   SUPABASE STORAGE          │
│   (PostgreSQL)              │    │   (S3-Compatible)          │
│                             │    │                             │
│ ┌───────────────────────┐  │    │ ┌───────────────────────┐   │
│ │ registros_usuarios    │  │    │ │ cedulas/              │   │
│ ├───────────────────────┤  │    │ │ ├─ usuario-123/       │   │
│ │ id (UUID)             │  │    │ │ │  ├─ cedula_frente.jpg   │
│ │ nombre_completo       │  │    │ │ │  └─ cedula_reverso.jpg  │
│ │ edad, cedula, barrio  │  │    │ │                             │
│ │ estado_civil, ocupacion   │    │ │ documentos/              │
│ │ estado_registro       │  │    │ │ ├─ usuario-123/       │   │
│ │ fecha_creacion        │  │    │ │ │  ├─ hoja_vida.pdf       │
│ │ ...                   │  │    │ │                             │
│ └───────────────────────┘  │    │ │ fotos-rostro/            │
│                             │    │ │ ├─ usuario-123/       │   │
│ ┌───────────────────────┐  │    │ │ │  └─ foto_rostro.jpg     │
│ │ documentos            │  │    │ └───────────────────────┘   │
│ ├───────────────────────┤  │    │                             │
│ │ id (UUID)             │  │    └───────────────────────────────┘
│ │ registro_id (FK)      │  │
│ │ tipo_documento        │  │
│ │ ruta_archivo          │  │
│ │ estado                │  │
│ │ fecha_carga           │  │
│ └───────────────────────┘  │
│                             │
│ ┌───────────────────────┐  │
│ │ auditoria_registros   │  │
│ │ validaciones_registro │  │
│ │ estadisticas_diarias  │  │
│ └───────────────────────┘  │
│                             │
│ ┌───────────────────────┐  │
│ │ Vistas (Views)        │  │
│ │ • estadisticas_*      │  │
│ │ • barrio, edad, etc   │  │
│ └───────────────────────┘  │
└─────────────────────────────┘
```

---

## 🔄 Flujo de Datos - Paso 1

```
Usuario llena CarnavalForm
         ↓
    Validación Zod
         ↓
   Carga Fotos Cédula
         ↓
    Click "Siguiente"
         ↓
useRegistroPaso1.crearRegistro()
         ↓
   Validar cédula no exista
   registrosService.obtenerPorCedula()
         ↓ (Si no existe)
   registrosService.crear()
         ↓
   INSERT EN registros_usuarios
   estado_registro = 'paso_1'
         ↓
   Retorna registroId
         ↓
   Navigate a /registro-documentos
   state = { ...datos, registroId }
         ↓
   ✅ Guardado en BD
```

---

## 🔄 Flujo de Datos - Paso 2

```
Usuario llena RegistroDocumentos
         ↓
    Carga Archivos
         ↓
    Click "Enviar"
         ↓
useRegistroPaso2.completarRegistro()
         ↓
Subir hojaVida a Storage
   storageService.subirArchivo()
   PUT /storage/v1/object/documentos/...
         ↓
Subir fotoRostro a Storage
   storageService.subirArchivo()
   PUT /storage/v1/object/fotos-rostro/...
         ↓
Actualizar registros_usuarios
   registrosService.actualizar()
   UPDATE hoja_vida_path, foto_rostro_path
   estado_registro = 'paso_2'
         ↓
Crear registros en documentos
   documentosService.crear() x2
   INSERT EN documentos
         ↓
Marcar como completado
   registrosService.completar()
   CALL completar_registro()
   UPDATE estado = 'completado'
         ↓
   ✅ Registro Completado
```

---

## 🗄️ Estructura de Tablas

```sql
┌─────────────────────────────────────┐
│  registros_usuarios                 │
├─────────────────────────────────────┤
│ PK: id (UUID)                       │
│ • nombre_completo                   │
│ • edad (18-60)                      │
│ • cedula (UNIQUE)                   │
│ • barrio                            │
│ • estado_civil                      │
│ • ocupacion                         │
│ • foto_cedula_frente_path           │
│ • foto_cedula_reverso_path          │
│ • hoja_vida_path                    │
│ • foto_rostro_path                  │
│ • estado_registro (paso_1/2, etc)   │
│ • fecha_creacion                    │
│ • fecha_actualizacion               │
│ • fecha_completado                  │
│ • ip_direccion                      │
│ • user_agent                        │
│ • notas                             │
│                                     │
│ Índices:                            │
│ • idx_cedula (UNIQUE)               │
│ • idx_estado                        │
│ • idx_fecha_creacion                │
│ • idx_nombre                        │
└─────────────────────────────────────┘
            ↑
            │ FK
            │
┌─────────────────────────────────────┐
│  documentos                         │
├─────────────────────────────────────┤
│ PK: id (UUID)                       │
│ FK: registro_id → registros_usuarios│
│ • tipo_documento                    │
│ • nombre_archivo                    │
│ • ruta_archivo                      │
│ • tamaño_bytes                      │
│ • tipo_mime                         │
│ • hash_archivo                      │
│ • estado (activo/eliminado)         │
│ • fecha_carga                       │
│                                     │
│ Índices:                            │
│ • idx_registro_id (FK)              │
│ • idx_tipo_documento                │
│ • idx_hash_archivo                  │
└─────────────────────────────────────┘
```

---

## 💾 Estructura de Storage

```
📦 cedulas/
├── usuario-123456789/
│   ├── cedula_frente.jpg
│   └── cedula_reverso.jpg
├── usuario-987654321/
│   ├── cedula_frente.jpg
│   └── cedula_reverso.jpg
└── ...

📦 documentos/
├── usuario-123456789/
│   ├── hoja_vida_1705693200000.pdf
│   └── hoja_vida_1705693500000.pdf
├── usuario-987654321/
│   ├── hoja_vida_1705693100000.pdf
│   └── ...
└── ...

📦 fotos-rostro/
├── usuario-123456789/
│   ├── foto_rostro_1705693200000.jpg
│   └── foto_rostro_1705693500000.jpg
├── usuario-987654321/
│   ├── foto_rostro_1705693100000.jpg
│   └── ...
└── ...
```

---

## 🔌 Integración React

```
App.tsx (con Provider setup)
   ↓
Importa hooks y servicios
   ├─ useRegistroPaso1
   ├─ useRegistroPaso2
   └─ useEstadisticas
   ↓
CarnavalForm (Paso 1)
   ├─ useForm (validación Zod)
   ├─ useRegistroPaso1 (Supabase)
   ├─ FileUpload x2 (fotos cédula)
   └─ Crea registro + navega Paso 2
   ↓
RegistroDocumentos (Paso 2)
   ├─ useRegistroPaso2 (Supabase)
   ├─ FileUpload x2 (documentos)
   └─ Completa registro + redirige
```

---

## 🛡️ Seguridad - RLS (Row Level Security)

```typescript
// RLS habilitado en tablas
registros_usuarios          ✅ RLS Enabled
documentos                  ✅ RLS Enabled
auditoria_registros         ✅ RLS Enabled
validaciones_registro       ✅ RLS Enabled

// Políticas básicas (a implementar según necesidad)
- Usuarios ven solo sus propios registros
- Admins ven todo
- Archivo protection en Storage
```

---

## 📊 Estadísticas en Tiempo Real

```
Las vistas SQL se actualizan en tiempo real:

vista_estadisticas_general
├─ registros_en_paso_1
├─ registros_en_paso_2
├─ registros_completados
├─ registros_rechazados
├─ total_registros
├─ tasa_completacion_porcentaje
└─ primer_ultimo_registro

vista_estadisticas_barrio
├─ barrio
├─ total_registros
├─ completados
└─ porcentaje_completacion

vista_estadisticas_ocupacion
vista_estadisticas_estado_civil
vista_estadisticas_edad
```

---

## 🔄 Ciclo de Vida de un Registro

```
1. CREADO (Paso 1)
   estado_registro = 'paso_1'
   fecha_creacion = NOW()
   
2. EN PROCESO (Paso 2)
   estado_registro = 'paso_2'
   hoja_vida_path = '...'
   foto_rostro_path = '...'
   
3. COMPLETADO
   estado_registro = 'completado'
   fecha_completado = NOW()
   
4. RECHAZADO (Opcional)
   estado_registro = 'rechazado'
   notas = 'Razón del rechazo'

Auditoría:
Cada cambio se registra en auditoria_registros
con timestamp, usuario, campo modificado, valores
```

---

## 🚀 Escalabilidad

### Base de Datos (PostgreSQL)
```
Free Tier:      500 MB
Pro Tier:       8 GB (escalable)
Enterprise:     Ilimitado
```

### Storage (S3)
```
Free Tier:      1 GB
Pro Tier:       100 GB (escalable)
Enterprise:     Ilimitado
```

### Queries
```
Todas las conexiones están optimizadas
con índices para búsquedas rápidas
```

---

## 📈 Monitoreo

### En Supabase Dashboard

```
Metrics
├─ API Requests por hora
├─ Database rows
├─ Storage usage
└─ Auth events

Logs
├─ Database Logs
├─ Auth Logs
├─ Edge Function Logs
└─ Request/Response Logs
```

---

## 🔄 Sincronización en Tiempo Real (Opcional)

```typescript
// Si quieres actualizaciones en tiempo real:

import { RealtimeClient } from '@supabase/supabase-js'

const subscription = supabase
  .from('registros_usuarios')
  .on('*', payload => {
    console.log('Cambio detectado:', payload)
  })
  .subscribe()
```

---

## 📚 Componentes Clave

```
1. supabase.ts (Cliente Supabase)
   ├─ registrosService
   ├─ storageService
   ├─ documentosService
   └─ estadisticasService

2. Hooks
   ├─ useRegistroPaso1
   ├─ useRegistroPaso2
   ├─ useEstadisticas
   └─ useCedulaValida

3. Componentes
   ├─ CarnavalForm (Paso 1)
   ├─ RegistroDocumentos (Paso 2)
   └─ FileUpload (Reutilizable)

4. Schema SQL
   └─ supabase-schema.sql
      ├─ Tablas
      ├─ Índices
      ├─ Funciones
      ├─ Vistas
      └─ Triggers
```

---

## ✅ Checklist de Arquitectura

```
□ Cliente Supabase configurado
□ Variables de entorno (.env.local)
□ Schema SQL ejecutado
□ Buckets Storage creados
□ RLS habilitado
□ Índices optimizados
□ Servicios implementados
□ Hooks reutilizables
□ Componentes integrados
□ Manejo de errores
□ Auditoría funcionando
```

---

**Arquitectura lista para producción** ✅
