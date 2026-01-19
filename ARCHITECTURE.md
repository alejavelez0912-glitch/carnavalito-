# 🏛️ ARQUITECTURA TÉCNICA DETALLADA

## 📐 Visión General de Capas

```
┌─────────────────────────────────────────────────────┐
│                   PRESENTACIÓN                       │
│  (React Components + Tailwind CSS + Shadcn/UI)     │
├─────────────────────────────────────────────────────┤
│              CONTROL DE ESTADO Y LÓGICA             │
│  (React Hooks + React Hook Form + React Router)    │
├─────────────────────────────────────────────────────┤
│                  VALIDACIÓN                          │
│           (Zod Schema Validation)                    │
├─────────────────────────────────────────────────────┤
│                UTILIDADES Y HOOKS                    │
│  (Custom Hooks + Utility Functions)                │
├─────────────────────────────────────────────────────┤
│              CAPA DE CONFIGURACIÓN                   │
│  (Vite Config + TypeScript + Tailwind)             │
└─────────────────────────────────────────────────────┘
```

---

## 📁 Estructura Detallada de Carpetas

### `src/pages/`
Contenedor de páginas/vistas principales

#### Index.tsx
**Responsabilidad:** Página de inicio - Paso 1 del registro  
**Imports clave:**
```typescript
- ConfettiBackground (decoración)
- HeroSection (banner)
- CarnavalForm (formulario paso 1)
- TrustSection (beneficios)
- Footer (pie)
```

**Estructura:**
```tsx
<div className="min-h-screen bg-background">
  <ConfettiBackground /> {/* Z-0 */}
  <div className="z-10">
    <HeroSection />
    <CarnavalForm />
    <TrustSection />
    <Footer />
  </div>
</div>
```

**Props:** None  
**Estado:** None (pasado a componentes hijos)  
**Efectos:** None

---

#### RegistroDocumentos.tsx
**Responsabilidad:** Página de documentos - Paso 2  
**Estado Esperado:**
```typescript
location.state = {
  nombreCompleto: string
  edad: number
  cedula: string
  barrio: string
  estadoCivil: string
  ocupacion: string
  fotoFrente: File
  fotoReverso: File
}
```

**Funciones Principales:**
```typescript
validateFiles()           // Verifica archivos requeridos
handleSubmit(e)          // Procesa envío (TODO: backend)
useEffect (verificación) // Redirige si no existe state
```

**Archivos que Acepta:**
- hojaVida: PDF, DOC, DOCX
- fotoRostro: JPG, PNG, GIF, WebP

---

#### NotFound.tsx
**Responsabilidad:** Página 404  
**Props:** None  
**Estado:** None

---

### `src/components/`
Componentes reutilizables y específicos del dominio

#### CarnavalForm.tsx
**Responsabilidad:** Formulario principal con validación Zod  

**Schema Zod:**
```typescript
z.object({
  nombreCompleto: z.string().min(3).max(100),
  edad: z.number().min(18).max(60),
  cedula: z.string().regex(/^\d{6,12}$/),
  barrio: z.string().min(2).max(100),
  estadoCivil: z.enum(["soltero", "casado", "union_libre"]),
  ocupacion: z.enum(["estudio", "trabajo", "ambos", "ninguno"]),
})
```

**Estado Local:**
```typescript
fotoFrente: File | null
fotoReverso: File | null
isSubmitting: boolean
photoErrors: { frente: string, reverso: string }
```

**Hooks:**
- `useForm` (react-hook-form)
- `useNavigate` (react-router-dom)
- `zodResolver` (@hookform/resolvers/zod)

**Flujo:**
1. Renderiza inputs con register()
2. Valida con Zod resolver
3. Captura fotos vía FileUpload
4. Valida fotos manualmente
5. Navega a paso 2 con state

---

#### FileUpload.tsx
**Responsabilidad:** Componente reutilizable para carga de archivos  

**Props:**
```typescript
interface FileUploadProps {
  label: string                    // Etiqueta del campo
  onChange: (file: File | null) => void // Callback
  accept?: string                  // Tipos MIME (default: image/*)
  required?: boolean               // Si es requerido
  error?: string                   // Mensaje de error
}
```

**Funciones:**
```typescript
handleFileChange(e)  // Lee archivo y genera preview
handleRemove(e)      // Limpia archivo y preview
handleClick()        // Abre input file
```

**Características:**
- Preview de imagen en tiempo real
- Botón para remover archivo
- Validación visual de error
- Ícono visual (Check/Upload)

---

#### HeroSection.tsx
**Responsabilidad:** Banner principal  

**Elementos:**
- Logo con ícono PartyPopper
- Título principal en H1
- Subtítulo con descripción
- Badge de "Convocatoria Abierta"
- Fechas (16-20 enero 2026)

**Estilos:**
- `text-4xl md:text-6xl` - Responsivo
- `carnaval-text-gradient` - Gradiente personalizado
- `carnaval-yellow/20` - Color con opacidad

---

#### TrustSection.tsx
**Responsabilidad:** Mostrar beneficios y requisitos  

**Beneficios:**
```typescript
[
  { icon: Users, title: "+500 vacantes", description: "Disponibles para ti" },
  { icon: Calendar, title: "4 semanas", description: "De trabajo garantizado" },
  { icon: CreditCard, title: "Pago puntual", description: "Uniforme incluido" },
  { icon: MessageCircle, title: "Respuesta rápida", description: "Vía WhatsApp" },
]
```

**Requisitos:**
```typescript
[
  "Ser mayor de 18 años",
  "Residir en Barranquilla",
  "Disponibilidad Pre-Carnaval y Carnaval",
  "Asistir a capacitación presencial (5 horas)",
]
```

**Grid:** `grid-cols-2 md:grid-cols-4` - Responsivo

---

#### ConfettiBackground.tsx
**Responsabilidad:** Animación de confeti decorativo  

**Estado:**
```typescript
confetti: ConfettiPiece[] = {
  id: number
  left: number (0-100%)
  delay: number (0-5s)
  duration: number (5-10s)
  color: string (5 colores carnaval)
  size: number (8-20px)
  rotation: number (0-360°)
}
```

**Animaciones:**
- Caída vertical suave
- Rotación gradual
- Opacidad 60%
- Z-index 0 (fondo)

---

#### Footer.tsx, NavLink.tsx
Componentes auxiliares de navegación y pie de página

---

### `src/hooks/`
Hooks personalizados reutilizables

#### use-mobile.tsx
**Propósito:** Detectar si la pantalla es móvil  
**Returns:** `boolean`

#### use-toast.ts
**Propósito:** Hook para notificaciones  
**Métodos:** 
- `toast.success(message)`
- `toast.error(message)`
- `toast.loading(message)`

---

### `src/lib/`
Funciones utilitarias globales

#### utils.ts
```typescript
export function cn(...inputs: ClassValue[]): string
// Combina clases de Tailwind inteligentemente
// = clsx + tailwind-merge

// Ej:
cn("px-2", "px-4") // Resultado: "px-4" (merge correcto)
```

---

### `src/components/ui/`
Componentes Shadcn/ui primitivos

**Componentes incluidos (30+):**
- Buttons
- Forms
- Inputs
- Cards
- Dialogs
- Alerts
- Tabs
- Toasts
- Y más...

**Estructura típica:**
```typescript
import * as React from "react"
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group"
import { cn } from "@/lib/utils"

const RadioGroup = React.forwardRef<...>
// Componente accesible + estilizado
```

---

## 🔄 Flujos de Datos Detallados

### Flujo: Paso 1 (CarnavalForm)

```typescript
// 1. Usuario completa formulario
<input {...register("nombreCompleto")} />
↓
// 2. Hook form captura valores
const data: FormData = { nombreCompleto, edad, ... }
↓
// 3. Zod valida
if (errors) {
  mostrar errores en UI
  return
}
↓
// 4. Valida archivos manualmente
if (!fotoFrente || !fotoReverso) {
  setPhotoErrors(...)
  return
}
↓
// 5. setIsSubmitting(true)
↓
// 6. Simula delay (500ms)
await new Promise(resolve => setTimeout(resolve, 500))
↓
// 7. Navigate con state
navigate("/registro-documentos", {
  state: { ...data, fotoFrente, fotoReverso }
})
↓
// 8. Toast éxito
toast.success("¡Paso 1 completado!")
↓
// 9. Usuario ve página Paso 2
```

### Flujo: Paso 2 (RegistroDocumentos)

```typescript
// 1. Component monta
// 2. useEffect verifica location.state
if (!step1Data) {
  navigate("/") // Redirige si no existe
}
↓
// 3. Usuario carga hojaVida y fotoRostro
<FileUpload onChange={setHojaVida} />
↓
// 4. handleSubmit valida archivos
if (!hojaVida || !fotoRostro) {
  setErrors(...)
  return
}
↓
// 5. Combina todos datos (Paso 1 + Paso 2)
const allData = { ...step1Data, hojaVida, fotoRostro }
↓
// 6. TODO: Enviar a backend
// await api.post('/registro', allData)
↓
// 7. setIsSuccess(true)
// Muestra pantalla de éxito
```

---

## 🎨 Sistema de Estilos

### Tailwind Configuration
**Ubicación:** `tailwind.config.ts`

**Colores Personalizados:**
```typescript
extend: {
  colors: {
    'carnaval-yellow': 'hsl(45 100% 50%)',
    'carnaval-green': 'hsl(160 70% 40%)',
    'carnaval-red': 'hsl(0 75% 55%)',
    'carnaval-orange': 'hsl(30 95% 55%)',
    'carnaval-purple': 'hsl(280 60% 50%)',
  }
}
```

**Plugins:**
- `@tailwindcss/typography` - Tipografía
- `tailwindcss-animate` - Animaciones

### CSS Global
**Ubicación:** `src/index.css`  
Contiene:
- Variables de colores CSS
- Estilos base
- Clases reutilizables (`.carnaval-border`, `.input-carnaval`)

---

## 🔐 Flujo de Validación

```
Input User
    ↓
Validación Cliente (Zod)
    ├─ Type checking
    ├─ Rango/longitud
    ├─ Regex patterns
    └─ Enumeraciones
    ↓
Mostrar errores si falla
    ↓
Validación de Archivos (Manual)
    ├─ ¿Existe el archivo?
    └─ ¿Tipo correcto?
    ↓
Si todo OK → Navigate/Submit
    ↓
TODO: Validación Backend
    ├─ Duplicados
    ├─ Business logic
    └─ Security checks
```

---

## 🧩 Inyección de Dependencias

### React Query
```typescript
const queryClient = new QueryClient()

<QueryClientProvider client={queryClient}>
  <App />
</QueryClientProvider>
```

### Routing
```typescript
<BrowserRouter>
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/registro-documentos" element={<RegistroDocumentos />} />
    <Route path="*" element={<NotFound />} />
  </Routes>
</BrowserRouter>
```

### Providers
```typescript
<QueryClientProvider>
  <TooltipProvider>
    <Toaster /> {/* Sonner */}
    <Toaster /> {/* React Toaster */}
    <BrowserRouter>
      {/* App */}
    </BrowserRouter>
  </TooltipProvider>
</QueryClientProvider>
```

---

## 🚀 Pipeline de Build

### Desarrollo
```
npm run dev
    ↓
Vite Dev Server
    ├─ Hot Module Replacement
    ├─ SWC para transpilación rápida
    └─ Component Tagger (Lovable)
    ↓
http://localhost:8080
```

### Producción
```
npm run build
    ↓
Vite Build
    ├─ Minificación
    ├─ Code splitting
    ├─ Tree shaking
    └─ Source maps
    ↓
dist/ folder
    ├─ index.html
    ├─ assets/
    │  ├─ main.js (minificado)
    │  ├─ main.css
    │  └─ chunks/
    └─ robots.txt
```

---

## 📊 Matriz de Componentes

| Componente | Tipo | Props | Estado | Hooks | Ruta |
|-----------|------|-------|--------|-------|------|
| Index | Page | - | - | - | `/` |
| RegistroDocumentos | Page | - | hojaVida, fotoRostro | useLocation, useNavigate | `/registro-documentos` |
| NotFound | Page | - | - | - | `*` |
| CarnavalForm | Component | - | form state | useForm, useNavigate | Index |
| FileUpload | Component | label, onChange, accept | preview, fileName | useRef, useState | CarnavalForm, RegistroDocumentos |
| HeroSection | Component | - | - | - | Index |
| TrustSection | Component | - | - | - | Index |
| ConfettiBackground | Component | - | confetti[] | useState, useEffect | Index, RegistroDocumentos |
| Footer | Component | - | - | - | Index |
| NavLink | Component | - | - | - | (deprecado/auxiliar) |

---

## ⚙️ Ciclo de Vida de Componentes

### CarnavalForm Lifecycle

```
MOUNT
    ↓
useForm(...) instancia
    ↓
RENDER (form inputs)
    ↓
Usuario interactúa
    ↓
onChange (react-hook-form)
    ↓
State updates (hooks internos)
    ↓
Re-render
    ↓
Usuario submite
    ↓
onSubmit → validación Zod
    ↓
Si error: setErrors(), re-render
    ↓
Si OK: validatePhotos() → navigate()
    ↓
UNMOUNT (navigate a otra ruta)
```

---

## 🔗 Dependencias de Componentes

```
App.tsx
├── QueryClientProvider
├── TooltipProvider
├── Toaster (sonner)
├── Toaster (radix)
└── BrowserRouter
    └── Routes
        ├── Index
        │   ├── ConfettiBackground
        │   ├── HeroSection
        │   ├── CarnavalForm
        │   │   ├── FileUpload (x2)
        │   │   └── toast/Sonner
        │   ├── TrustSection
        │   └── Footer
        ├── RegistroDocumentos
        │   ├── ConfettiBackground
        │   ├── FileUpload (x2)
        │   └── toast/Sonner
        └── NotFound
```

---

## 🔐 Seguridad (Estado Actual)

### ✅ Implementado
- Validación cliente (Zod)
- TypeScript tipado
- React Router protege rutas con state

### ⚠️ Pendiente
- Validación servidor
- CORS/CSRF
- Rate limiting
- Sanitización de input
- File type validation
- File size limits
- Authentication
- Authorization

---

**Última actualización:** 19/01/2026
