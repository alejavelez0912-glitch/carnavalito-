# 🚀 GUÍA RÁPIDA DEL PROYECTO

## ⚡ Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar desarrollo
npm run dev
# Accede a http://localhost:8080

# Build para producción
npm run build

# Tests
npm run test
npm run test:watch
```

---

## 📍 Mapa del Proyecto

### Estructura de Archivos Clave

```
src/
├── pages/                    # Páginas principales
│   ├── Index.tsx            ← PÁGINA PRINCIPAL (Paso 1: Datos personales + fotos cédula)
│   ├── RegistroDocumentos.tsx ← PASO 2 (Documentos + foto rostro)
│   └── NotFound.tsx         ← 404 page
├── components/
│   ├── CarnavalForm.tsx     ← FORMULARIO PRINCIPAL (validación Zod)
│   ├── FileUpload.tsx       ← COMPONENTE CARGA ARCHIVOS (reutilizable)
│   ├── HeroSection.tsx      ← Banner principal
│   ├── TrustSection.tsx     ← Beneficios + requisitos
│   ├── ConfettiBackground.tsx ← Animación confeti
│   ├── Footer.tsx           ← Pie de página
│   ├── NavLink.tsx          ← Navegación
│   └── ui/                  ← 30+ componentes Shadcn
├── hooks/                   ← Hooks reutilizables
│   ├── use-mobile.tsx
│   └── use-toast.ts
├── lib/
│   └── utils.ts             ← Utilidades (cn para clsx + tailwind-merge)
├── App.tsx                  ← Raíz + Router
├── main.tsx                 ← Punto de entrada
└── index.css                ← Estilos globales
```

---

## 🔄 Flujo de Datos

```
Usuario Ingresa
        ↓
    (/):
        ↓
    HeroSection (título + info)
        ↓
    CarnavalForm (paso 1)
        ├─ Validación con Zod
        ├─ Captura: nombre, edad, cédula, barrio, estado civil, ocupación
        ├─ Captura: foto frente y reverso de cédula (FileUpload)
        └─ Navigate a /registro-documentos con state
        ↓
    (/registro-documentos):
        ↓
    RegistroDocumentos (paso 2)
        ├─ Valida que existan datos paso 1
        ├─ Captura: hoja de vida + foto rostro
        ├─ Combina todos los datos
        └─ (TODO: Enviar a backend)
        ↓
    ✅ Completado
```

---

## 🎨 Estilos Personalizados

### Clases CSS Clave

```css
/* Definidas en tailwind.config.ts o globals */
.carnaval-text-gradient    /* Gradiente Carnaval */
.carnaval-border           /* Borde personalizado */
.input-carnaval            /* Input styling */
.file-upload-zone          /* Zona de carga de archivos */
.confetti-bg               /* Fondo confeti */
```

### Colores

```javascript
carnaval-yellow   // #FFFF00 (brillante)
carnaval-green    // #00AA00 (verdoso)
carnaval-red      // #FF0000 (rojo)
carnaval-orange   // #FF8800 (naranja)
carnaval-purple   // #8800FF (púrpura)
```

---

## 📝 Scripts de NPM

| Comando | Función |
|---------|---------|
| `npm run dev` | Dev server en http://localhost:8080 |
| `npm run build` | Build producción |
| `npm run build:dev` | Build en modo desarrollo |
| `npm run lint` | Verificar código con ESLint |
| `npm run preview` | Previewizar build |
| `npm run test` | Ejecutar tests una vez |
| `npm run test:watch` | Ejecutar tests en modo watch |

---

## 🔐 Validaciones

### CarnavalForm (Zod Schema)

```typescript
nombreCompleto: string (3-100 chars)
edad: number (18-60)
cedula: string (6-12 dígitos)
barrio: string (2-100 chars)
estadoCivil: "soltero" | "casado" | "union_libre"
ocupacion: "estudio" | "trabajo" | "ambos" | "ninguno"
fotoFrente: File (requerida)
fotoReverso: File (requerida)
```

### RegistroDocumentos

```typescript
hojaVida: File (requerida)
fotoRostro: File (requerida)
```

---

## 📦 Dependencias Principales

### Core
- `react@18.3.1` - UI Library
- `react-dom@18.3.1` - DOM renderer
- `typescript@5.8.3` - Type checking

### Build & Dev
- `vite@5.4.19` - Build tool
- `@vitejs/plugin-react-swc@3.11.0` - React + SWC para Vite
- `tailwindcss@3.4.17` - CSS framework

### UI Components
- `@radix-ui/*` - Primitivos sin estilos
- `shadcn/ui` - Componentes construidos sobre Radix

### Forms & Validation
- `react-hook-form@7.61.1` - Form state management
- `zod@3.25.76` - Schema validation
- `@hookform/resolvers@3.10.0` - Resolvers para form validators

### Routing
- `react-router-dom@6.30.1` - Client-side routing

### Otros
- `sonner@1.7.4` - Toast notifications
- `lucide-react@0.462.0` - Icons
- `clsx@2.1.1` - Conditional classnames
- `tailwind-merge@2.6.0` - Merge Tailwind classes

---

## 🎯 Puntos de Entrada Clave

### Para agregar nuevas páginas:
1. Crear archivo en `src/pages/NuevaPagina.tsx`
2. Agregar ruta en `src/App.tsx`

```typescript
// En App.tsx
<Route path="/nueva-ruta" element={<NuevaPagina />} />
```

### Para agregar nuevos componentes:
1. Crear archivo en `src/components/NuevoComponente.tsx`
2. Exportar e importar donde se necesite

### Para agregar nuevos elementos UI:
1. Usar componentes de `src/components/ui/`
2. O crear nuevos basados en Shadcn/ui

---

## 🧪 Testing

**Framework:** Vitest 3.2.4

```bash
# Tests una sola vez
npm run test

# Tests en modo watch (se ejecutan al editar)
npm run test:watch
```

**Archivo de setup:** `src/test/setup.ts`  
**Archivos de test:** `src/test/*.test.ts`

---

## 🌐 Routing Map

| Ruta | Componente | Descripción |
|------|-----------|-------------|
| `/` | Index.tsx | Página principal - Paso 1 |
| `/registro-documentos` | RegistroDocumentos.tsx | Paso 2 - Documentos |
| `*` | NotFound.tsx | 404 - No encontrado |

---

## 💡 Tips y Trucos

### 1. Usar el alias `@` para imports
```typescript
// ✅ Bueno
import { Button } from "@/components/ui/button"

// ❌ Malo
import { Button } from "../../../components/ui/button"
```

### 2. Acceder a utils
```typescript
import { cn } from "@/lib/utils"
// cn es clsx + tailwind-merge, useful para combinar clases
```

### 3. Usar Toast notificaciones
```typescript
import { toast } from "sonner"

toast.success("¡Éxito!")
toast.error("Error!")
toast.loading("Cargando...")
```

### 4. Pasar datos entre rutas
```typescript
// En origen
navigate("/destino", { state: { data: value } })

// En destino
const location = useLocation()
const data = location.state?.data
```

### 5. Validar formulario
```typescript
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"

const schema = z.object({
  name: z.string().min(3)
})

const { register } = useForm({
  resolver: zodResolver(schema)
})
```

---

## 🔧 Configuración Port

- **Dev Server:** `http://localhost:8080`
- **IPv6 Host:** `::`
- **HMR Overlay:** Desactivado

---

## 📚 Convocatoria Actual

- **Evento:** Carnaval de Barranquilla 2026
- **Período:** 16 - 20 de enero de 2026
- **Vacantes:** +500
- **Duración:** 4 semanas garantizado
- **Requisito Principal:** Mayor de 18 años, residente Barranquilla
- **Capacitación:** 5 horas presencial

---

## ⚠️ Cosas TODO / En Desarrollo

- [ ] Integración de backend
- [ ] Envío real de formularios
- [ ] Persistencia de datos
- [ ] Validación de tipo/tamaño de archivo
- [ ] Sistema de autenticación
- [ ] Dashboard de administración
- [ ] Analytics
- [ ] Email confirmation

---

## 🆘 Troubleshooting

### El servidor no inicia
```bash
# Limpia node_modules y reinstala
rm -r node_modules
npm install
npm run dev
```

### Errores de TypeScript
```bash
# Verifica la configuración
npm run lint
```

### El build falla
```bash
# Intenta build en modo desarrollo
npm run build:dev
```

---

**Última actualización:** 19/01/2026  
**Versión:** 1.0.0
