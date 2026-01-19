# ✅ CHECKLIST SUPABASE SETUP & INTEGRATION

> Guía paso a paso para implementar Supabase en el proyecto

---

## 📋 FASE 1: CREAR PROYECTO SUPABASE (5-10 min)

- [ ] **1.1** Abrir https://supabase.com
- [ ] **1.2** Hacer clic en "Sign Up" (o login si ya tienes cuenta)
- [ ] **1.3** Crear nuevo proyecto:
  - [ ] Nombre: `carnaval-jobs-db`
  - [ ] Región: `South America - São Paulo` (más cercana a Colombia)
  - [ ] Contraseña BD: Generar fuerte (guardar en gestor de contraseñas)
  - [ ] Habilitar "Discussions" si lo deseas (opcional)
- [ ] **1.4** Esperar a que el proyecto se complete (2-3 minutos)
- [ ] **1.5** Una vez listo, ir a **Settings > API** y copiar:
  - [ ] `VITE_SUPABASE_URL` (de Project URL)
  - [ ] `VITE_SUPABASE_ANON_KEY` (de anon public)

---

## 📊 FASE 2: IMPORTAR SCHEMA SQL (3-5 min)

- [ ] **2.1** En Supabase, ir a **SQL Editor**
- [ ] **2.2** Crear nueva query:
  - [ ] Botón "New Query"
  - [ ] O hacer clic en "+" en la sidebar
- [ ] **2.3** Abrir archivo `supabase-schema.sql` en VS Code
- [ ] **2.4** Copiar TODO el contenido SQL
- [ ] **2.5** Pegar en Supabase SQL Editor
- [ ] **2.6** Hacer clic en botón ▶ (Run) o Ctrl+Enter
- [ ] **2.7** Esperar confirmación: `10 rows affected` (creando tablas/vistas/funciones)
- [ ] **2.8** Verificar que NO hay errores en rojo

**Validación:**
- [ ] Ir a **Table Editor** y ver 5 tablas nuevas:
  - [ ] `registros_usuarios`
  - [ ] `documentos`
  - [ ] `auditoria_registros`
  - [ ] `validaciones_registro`
  - [ ] `estadisticas_diarias`

---

## 🪣 FASE 3: CREAR STORAGE BUCKETS (2-3 min)

- [ ] **3.1** En Supabase, ir a **Storage** (sidebar izquierda)
- [ ] **3.2** Crear bucket 1: `cedulas`
  - [ ] Nombre: `cedulas`
  - [ ] Privado/Público: Público (para testing, cambiar a privado en prod)
  - [ ] Clic en **Create bucket**
- [ ] **3.3** Crear bucket 2: `documentos`
  - [ ] Nombre: `documentos`
  - [ ] Privado/Público: Privado (solo acceso autenticado)
  - [ ] Clic en **Create bucket**
- [ ] **3.4** Crear bucket 3: `fotos-rostro`
  - [ ] Nombre: `fotos-rostro`
  - [ ] Privado/Público: Privado
  - [ ] Clic en **Create bucket**

**Validación:**
- [ ] En **Storage**, ver 3 buckets listados

---

## 🔐 FASE 4: CONFIGURAR VARIABLES DE ENTORNO (2 min)

- [ ] **4.1** En VS Code, abrir archivo `.env.example` (en raíz del proyecto)
- [ ] **4.2** Crear nuevo archivo `.env.local` en la raíz
- [ ] **4.3** Copiar contenido de `.env.example` a `.env.local`
- [ ] **4.4** En Supabase, ir a **Settings > API**
- [ ] **4.5** Copiar `Project URL` (es la URL de la BD)
- [ ] **4.6** En `.env.local`, reemplazar `VITE_SUPABASE_URL=` con:
  ```
  VITE_SUPABASE_URL=https://xxxxxxxxx.supabase.co
  ```
- [ ] **4.7** Copiar `anon public` (clave pública)
- [ ] **4.8** En `.env.local`, reemplazar `VITE_SUPABASE_ANON_KEY=` con:
  ```
  VITE_SUPABASE_ANON_KEY=eyJhbGc...xxxxx...
  ```

**Resultado final en `.env.local`:**
```
VITE_SUPABASE_URL=https://xxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...xxxxx...
```

**⚠️ IMPORTANTE:**
- [ ] NO commitar `.env.local` a git (ya está en .gitignore)
- [ ] NO compartir estas claves

---

## 📦 FASE 5: INSTALAR DEPENDENCIAS (2-3 min)

En terminal (en raíz del proyecto):

```bash
npm install
```

O si usas bun (como indica `bun.lockb`):

```bash
bun install
```

Debería instalar:
- [ ] `@supabase/supabase-js@^2.38.4`
- [ ] Todas las demás dependencias

**Validación:**
- [ ] Abrir `package-lock.json` (o `bun.lockb`)
- [ ] Buscar `@supabase/supabase-js`
- [ ] Debe estar versión `2.38.4` o superior

---

## 🧪 FASE 6: VERIFICAR CONEXIÓN (5 min)

- [ ] **6.1** En VS Code, abrir terminal integrada
- [ ] **6.2** Ejecutar comando de test:

```bash
npm run dev
```

- [ ] **6.3** Abrir navegador: http://localhost:5173
- [ ] **6.4** Abrir Console (F12 > Console)
- [ ] **6.5** En archivo `src/main.tsx`, agregar test temporal:

```typescript
// Agregar al inicio de main.tsx
import { supabase } from './lib/supabase'

supabase.auth.getSession().then(({ data }) => {
  console.log('✅ Supabase conectado correctamente')
  console.log('Sesión actual:', data)
}).catch(error => {
  console.error('❌ Error conectando a Supabase:', error)
})
```

- [ ] **6.6** Guardar y verificar en Console:
  - [ ] Debe ver: `✅ Supabase conectado correctamente`
  - [ ] Debe ver: `Sesión actual: null` (es normal, no hay usuario logueado)
- [ ] **6.7** Eliminar el código de test del paso 6.5 (opcional)

---

## 🎣 FASE 7: PROBAR OPERACIONES BÁSICAS (10 min)

### Test 1: Crear Registro

En Console (F12):

```javascript
// Copiar y ejecutar en Console
const { data, error } = await fetch('/.netlify/functions/test-registro').then(r => r.json())
console.log(data, error)

// O directamente en tu componente, agregar un botón para probar:
```

**O agregar test en un componente:**

```typescript
// En src/pages/Index.tsx, agregar botón temporal
import { registrosService } from '@/lib/supabase'

async function testCrearRegistro() {
  const { data, error } = await registrosService.crear({
    nombre_completo: 'Test User',
    edad: 25,
    cedula: '999999999',
    barrio: 'Test',
    estado_civil: 'soltero',
    ocupacion: 'trabajo'
  })
  
  if (error) {
    console.error('Error:', error)
  } else {
    console.log('✅ Registro creado:', data.id)
  }
}

// Agregar button: <button onClick={testCrearRegistro}>Test Crear Registro</button>
```

- [ ] Hacer clic en botón
- [ ] Ver en Console: `✅ Registro creado: [ID]`
- [ ] Ir a Supabase **Table Editor > registros_usuarios**
- [ ] Ver fila nueva con datos de prueba

### Test 2: Leer Registro

```typescript
const { data } = await registrosService.obtenerPorCedula('999999999')
console.log('Registro encontrado:', data)
```

- [ ] Debe retornar el registro que creaste

### Test 3: Actualizar Registro

```typescript
const { data } = await registrosService.actualizar('ID-DEL-REGISTRO', {
  barrio: 'San José (actualizado)',
  notas: 'Test de actualización'
})
console.log('Actualizado:', data)
```

- [ ] Ir a tabla en Supabase y verificar cambios

- [ ] **7.1** Después de tests exitosos, eliminar código de prueba

---

## 🎣 FASE 8: LIMPIAR DATOS DE PRUEBA (2 min)

- [ ] **8.1** En Supabase **Table Editor > registros_usuarios**
- [ ] **8.2** Seleccionar fila con cédula `999999999`
- [ ] **8.3** Botón **Delete** (papelera)
- [ ] **8.4** Confirmar eliminación
- [ ] **8.5** Verificar que tabla queda vacía (0 rows)

---

## 🪝 FASE 9: CREAR REACT HOOKS (20 min)

**Objetivo:** Crear hooks reutilizables para manejo de formularios

### 9.1 Hook para Paso 1 (useRegistroPaso1)

**Crear archivo:** `src/hooks/useRegistroPaso1.ts`

```typescript
import { useState } from 'react'
import { registrosService } from '@/lib/supabase'
import { toast } from 'sonner'

export function useRegistroPaso1() {
  const [loading, setLoading] = useState(false)
  const [registro, setRegistro] = useState<any>(null)

  const crear = async (datos: any) => {
    setLoading(true)
    try {
      // Validar cédula única
      const existente = await registrosService.obtenerPorCedula(datos.cedula)
      if (existente && existente.data) {
        toast.error('Cédula ya está registrada')
        return { success: false }
      }

      // Crear registro
      const resultado = await registrosService.crear(datos)
      
      if (resultado.success) {
        setRegistro(resultado.data)
        toast.success('Registro creado correctamente')
        return { success: true, id: resultado.data.id }
      } else {
        toast.error(resultado.error || 'Error creando registro')
        return { success: false }
      }
    } catch (error) {
      toast.error('Error inesperado')
      console.error(error)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return { crear, loading, registro }
}
```

- [ ] Crear archivo en ruta especificada
- [ ] Copiar código anterior
- [ ] Guardar archivo

### 9.2 Hook para Paso 2 (useRegistroPaso2)

**Crear archivo:** `src/hooks/useRegistroPaso2.ts`

```typescript
import { useState } from 'react'
import { registrosService, storageService, documentosService } from '@/lib/supabase'
import { toast } from 'sonner'

export function useRegistroPaso2() {
  const [loading, setLoading] = useState(false)

  const completar = async (registroId: string, archivos: {
    hojaVida?: File
    fotoRostro?: File
  }) => {
    setLoading(true)
    try {
      const cedula = localStorage.getItem(`cedula-${registroId}`)
      
      // Subir archivos
      let hojaVidaPath = null
      let fotoRostroPath = null

      if (archivos.hojaVida) {
        const resultado = await storageService.subirArchivo(
          'documentos',
          archivos.hojaVida,
          cedula || registroId,
          'hoja_vida'
        )
        hojaVidaPath = resultado.ruta
      }

      if (archivos.fotoRostro) {
        const resultado = await storageService.subirArchivo(
          'fotos-rostro',
          archivos.fotoRostro,
          cedula || registroId,
          'foto_rostro'
        )
        fotoRostroPath = resultado.ruta
      }

      // Actualizar registro
      const actualizar = await registrosService.actualizar(registroId, {
        hoja_vida_path: hojaVidaPath,
        foto_rostro_path: fotoRostroPath,
        estado_registro: 'completado'
      })

      if (actualizar.success) {
        // Marcar como completado
        await registrosService.completar(registroId)
        toast.success('Registro completado correctamente')
        return { success: true }
      } else {
        toast.error('Error completando registro')
        return { success: false }
      }
    } catch (error) {
      toast.error('Error inesperado')
      console.error(error)
      return { success: false }
    } finally {
      setLoading(false)
    }
  }

  return { completar, loading }
}
```

- [ ] Crear archivo en `src/hooks/useRegistroPaso2.ts`
- [ ] Copiar código anterior
- [ ] Guardar archivo

---

## 🔗 FASE 10: INTEGRAR EN COMPONENTES (30 min)

### 10.1 Modificar CarnavalForm.tsx

**Ubicación:** `src/components/CarnavalForm.tsx`

Agregar al inicio del archivo:

```typescript
import { useRegistroPaso1 } from '@/hooks/useRegistroPaso1'
```

En la función `CarnavalForm`, agregar:

```typescript
const { crear: crearRegistro, loading: cargando } = useRegistroPaso1()
```

En el `onSubmit` del formulario, reemplazar console.log por:

```typescript
const resultado = await crearRegistro(data)
if (resultado.success) {
  // Guardar ID del registro en sessionStorage
  sessionStorage.setItem('registroId', resultado.id)
  
  // Navegar a paso 2
  navigate('/registrodocumentos')
} else {
  // El toast error ya se mostró en el hook
}
```

- [ ] Abrir `src/components/CarnavalForm.tsx`
- [ ] Agregar importación de hook
- [ ] Reemplazar lógica de submit
- [ ] Guardar archivo

### 10.2 Modificar RegistroDocumentos.tsx

**Ubicación:** `src/pages/RegistroDocumentos.tsx`

Agregar al inicio del archivo:

```typescript
import { useRegistroPaso2 } from '@/hooks/useRegistroPaso2'
```

En el componente, agregar:

```typescript
const { completar: completarRegistro, loading: cargando } = useRegistroPaso2()

const registroId = sessionStorage.getItem('registroId')
```

En el submit del formulario:

```typescript
const resultado = await completarRegistro(registroId, {
  hojaVida: filePaso2?.hojaVida,
  fotoRostro: filePaso2?.fotoRostro
})

if (resultado.success) {
  toast.success('¡Registro completado correctamente!')
  navigate('/')
}
```

- [ ] Abrir `src/pages/RegistroDocumentos.tsx`
- [ ] Agregar importación de hook
- [ ] Integrar lógica
- [ ] Guardar archivo

---

## 🧪 FASE 11: PRUEBA COMPLETA (15-20 min)

### Test End-to-End

- [ ] **11.1** Ejecutar `npm run dev`
- [ ] **11.2** Abrir http://localhost:5173 en navegador
- [ ] **11.3** Llenar y enviar Paso 1:
  - [ ] Ingresar datos válidos
  - [ ] Hacer clic en "Siguiente"
  - [ ] Debe mostrar toast verde: "Registro creado correctamente"
  - [ ] Debe redirigir a Paso 2

- [ ] **11.4** Llenar y enviar Paso 2:
  - [ ] Subir dos archivos (PDF y foto)
  - [ ] Hacer clic en "Enviar"
  - [ ] Debe mostrar toast verde: "Registro completado correctamente"
  - [ ] Debe redirigir a home

- [ ] **11.5** Verificar en Supabase:
  - [ ] **Table Editor > registros_usuarios**: Ver nuevo registro
  - [ ] **Storage > documentos**: Ver archivos subidos
  - [ ] **Storage > fotos-rostro**: Ver foto subida

### Test de Validaciones

- [ ] **11.6** Intentar cédula duplicada:
  - [ ] Llenar Paso 1 con misma cédula
  - [ ] Debe mostrar toast rojo: "Cédula ya está registrada"

- [ ] **11.7** Intentar archivo demasiado grande:
  - [ ] Intentar subir archivo > 5MB
  - [ ] Debe mostrar mensaje de error

---

## 📊 FASE 12: CONFIGURAR ESTADÍSTICAS (5 min)

- [ ] **12.1** En `src/pages/Index.tsx`, agregar visor de estadísticas (opcional):

```typescript
import { estadisticasService } from '@/lib/supabase'

// En useEffect al cargar página
useEffect(() => {
  async function cargarEstadisticas() {
    const { data } = await estadisticasService.obtenerGenerales()
    console.log('Estadísticas:', data)
    // Mostrar en UI si lo deseas
  }
  cargarEstadisticas()
}, [])
```

- [ ] **12.2** Opcionalmente, crear componente `EstadisticasWidget.tsx` para mostrar métricas

---

## 🚀 FASE 13: DEPLOY A PRODUCCIÓN (TODO)

**Pendiente después de validar en desarrollo:**

- [ ] Cambiar buckets de `público` a `privado`
- [ ] Implementar autenticación real (email/password o OAuth)
- [ ] Agregar validación de imágenes en servidor
- [ ] Configurar RLS (Row Level Security) para usuarios
- [ ] Setup de backup automático
- [ ] Monitoreo y logs
- [ ] Deploy a Vercel/Netlify con variables de entorno

---

## 🎉 ¡LISTO!

Cuando termines todas las fases:

✅ Base de datos completamente funcional
✅ Almacenamiento de archivos operativo  
✅ Formularios integrados con Supabase
✅ Validaciones en BD
✅ Sistema de auditoría activo
✅ Estadísticas en tiempo real

---

## 📚 DOCUMENTOS DE REFERENCIA

- [SUPABASE_SETUP.md](SUPABASE_SETUP.md) - Guía detallada Supabase
- [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md) - Patrones React
- [SUPABASE_ARQUITECTURA.md](SUPABASE_ARCHITECTURE.md) - Diagramas
- [SUPABASE_COMANDOS.md](SUPABASE_COMANDOS.md) - Referencia SQL/TS
- [src/lib/supabase.ts](src/lib/supabase.ts) - Código del cliente

**¿Preguntas?** Revisa el CHANGELOG.md para ver cambios registrados
