# 📊 ANÁLISIS COMPLETO DEL PROYECTO

## 🎯 Resumen Ejecutivo

**Nombre del Proyecto:** Carnaval Jobs Landing  
**Propósito:** Landing page de reclutamiento para el Carnaval de Barranquilla 2026  
**Fecha de Análisis:** 19 de enero de 2026

---

## 📋 Stack Tecnológico

### Frontend Framework
- **React** 18.3.1 - Librería UI
- **TypeScript** 5.8.3 - Tipado estático
- **Vite** 5.4.19 - Build tool y dev server
- **React Router DOM** 6.30.1 - Routing/navegación

### UI Components
- **Shadcn/ui** - Librería de componentes accesibles
- **Radix UI** - Primitivos de UI sin estilos
- **Tailwind CSS** 3.4.17 - Utility-first CSS framework
- **Lucide React** 0.462.0 - Iconografía

### Form & Validation
- **React Hook Form** 7.61.1 - Gestión de formularios
- **Zod** 3.25.76 - Validación de esquemas
- **@hookform/resolvers** 3.10.0 - Integración con validadores

### UI Enhancements
- **Sonner** 1.7.4 - Notificaciones tipo toast
- **Embla Carousel** 8.6.0 - Componentes carousel
- **Input OTP** 1.4.2 - Entrada OTP
- **Next Themes** 0.3.0 - Soporte para temas

### Data & Queries
- **TanStack React Query** 5.83.0 - Gestión de estado asincrónico
- **Date FNS** 3.6.0 - Manipulación de fechas

### Charting
- **Recharts** 2.15.4 - Visualización de datos

### Dev Tools
- **Vitest** 3.2.4 - Testing framework
- **ESLint** 9.32.0 - Linting
- **TypeScript ESLint** 8.38.0 - Reglas ESLint para TypeScript
- **Lovable Tagger** 1.1.13 - Herramienta de generación de componentes

---

## 🏗️ Estructura del Proyecto

```
carnaval-jobs-landing/
├── src/
│   ├── components/
│   │   ├── CarnavalForm.tsx          # Formulario principal (Paso 1)
│   │   ├── ConfettiBackground.tsx    # Fondo animado con confeti
│   │   ├── FileUpload.tsx            # Componente reutilizable de carga
│   │   ├── Footer.tsx                # Pie de página
│   │   ├── HeroSection.tsx           # Sección de bienvenida
│   │   ├── NavLink.tsx               # Enlaces de navegación
│   │   ├── TrustSection.tsx          # Sección de beneficios y requisitos
│   │   └── ui/                       # Componentes Shadcn/ui
│   │       └── [30+ componentes]     # Conjunto completo de UI components
│   ├── pages/
│   │   ├── Index.tsx                 # Página principal (Paso 1 - Datos personales)
│   │   ├── RegistroDocumentos.tsx    # Página Paso 2 - Carga de documentos
│   │   └── NotFound.tsx              # Página 404
│   ├── hooks/
│   │   ├── use-mobile.tsx            # Hook para detectar mobile
│   │   └── use-toast.ts              # Hook para notificaciones
│   ├── lib/
│   │   └── utils.ts                  # Funciones utilitarias
│   ├── App.tsx                       # Componente raíz con routing
│   ├── App.css                       # Estilos globales
│   ├── index.css                     # Estilos base
│   ├── main.tsx                      # Punto de entrada
│   └── vite-env.d.ts                 # Declaraciones de tipos Vite
├── public/
│   └── robots.txt                    # SEO - robots
├── Configuración
│   ├── vite.config.ts                # Configuración Vite
│   ├── tailwind.config.ts            # Configuración Tailwind
│   ├── postcss.config.js             # Procesamiento CSS
│   ├── tsconfig.*.json               # Configuraciones TypeScript
│   └── components.json               # Metadata de componentes Shadcn
└── package.json                      # Dependencias y scripts
```

---

## 🔄 Flujo de la Aplicación

### Ruta 1: `/` (Index Page - Paso 1)
**Componentes:**
- `HeroSection` - Banner principal atractivo
- `CarnavalForm` - Formulario de inscripción
- `TrustSection` - Beneficios y requisitos
- `Footer` - Pie de página
- `ConfettiBackground` - Animación de fondo

**Funcionalidades:**
```
Recolecta:
├── Datos Personales
│   ├── Nombre completo (string, 3-100 caracteres)
│   ├── Edad (number, 18-60)
│   ├── Cédula (string, 6-12 dígitos)
│   ├── Barrio (string, 2-100 caracteres)
│   ├── Estado Civil (enum: soltero, casado, union_libre)
│   └── Ocupación (enum: estudio, trabajo, ambos, ninguno)
└── Documentos (Paso 1)
    ├── Foto frente de cédula (File)
    └── Foto reverso de cédula (File)
```

**Validación:**
- Zod schema para datos personales
- Validación manual para archivos
- Notificaciones con Sonner

---

### Ruta 2: `/registro-documentos` (Paso 2)
**Componentes:**
- `ConfettiBackground`
- `FileUpload` (reutilizable)
- Componentes de UI personalizados

**Funcionalidades:**
```
Recolecta documentos adicionales:
├── Hoja de Vida (File: PDF/DOC)
└── Foto del Rostro (File: imagen)

Combina con datos del Paso 1 (via React Router state)
```

**Flujo:**
1. Valida que existan datos del Paso 1
2. Si no existen, redirige a home
3. Permite carga de documentos complementarios
4. Validación de archivos requeridos

---

### Ruta 3: `*` (NotFound)
- Página 404 para rutas no existentes

---

## 🎨 Diseño Visual

### Identidad de Carnaval
**Colores:**
- `carnaval-yellow` - Amarillo vibrante
- `carnaval-green` - Verde festivo
- `carnaval-red` - Rojo destacado
- `carnaval-orange` - Naranja energético
- `carnaval-purple` - Púrpura festivo

### Estilos Aplicados
- **Gradientes:** Textos con gradiente de carnaval
- **Bordes:** Bordes personalizados `.carnaval-border`
- **Inputs:** Estilos personalizados `.input-carnaval`
- **Confeti:** Animación de fondo festiva

---

## 📱 Responsividad

La aplicación está diseñada con mobile-first approach:

```
Breakpoints:
├── Mobile (< 640px)  - Una columna
├── Tablet (640px+)   - Grid adaptable
└── Desktop (1024px+) - Layout óptimo
```

Componentes clave usan:
- `grid grid-cols-2 md:grid-cols-4` - Adapta a pantalla
- `text-2xl md:text-3xl` - Tipografía fluida
- Máximo ancho contenido: `max-w-lg mx-auto`

---

## 🔐 Validaciones

### CarnavalForm
```typescript
nombreCompleto: min 3, max 100 caracteres
edad: 18-60 años
cedula: 6-12 dígitos
barrio: 2-100 caracteres
estadoCivil: soltero | casado | union_libre
ocupacion: estudio | trabajo | ambos | ninguno
fotoFrente: requerida
fotoReverso: requerida
```

### RegistroDocumentos
```typescript
hojaVida: requerida
fotoRostro: requerida
```

---

## 🚀 Scripts Disponibles

```bash
npm run dev          # Inicia servidor desarrollo (puerto 8080)
npm run build        # Build producción
npm run build:dev    # Build en modo desarrollo
npm run lint         # Ejecuta ESLint
npm run preview      # Preview del build
npm run test         # Ejecuta tests vitest
npm run test:watch   # Tests en modo watch
```

---

## 🧪 Testing

**Framework:** Vitest 3.2.4  
**Librerías:**
- `@testing-library/react` 16.0.0
- `@testing-library/jest-dom` 6.6.0
- `jsdom` 20.0.3

**Archivo:** `src/test/setup.ts`

---

## 🔧 Configuración del Servidor Dev

```typescript
Host: "::" (IPv6)
Puerto: 8080
HMR Overlay: Desactivado
Module: ES
Tipo: React + SWC
```

---

## 📊 Alias de Import

```typescript
@ = ./src
```

Ej: `import { Button } from "@/components/ui/button"`

---

## 🎯 Requisitos Mostrados

En la sección de confianza:

```
✓ Ser mayor de 18 años
✓ Residir en Barranquilla
✓ Disponibilidad Pre-Carnaval y Carnaval
✓ Asistir a capacitación presencial (5 horas)
```

---

## 💡 Beneficios Promocionados

- **+500 vacantes** disponibles
- **4 semanas** de trabajo garantizado
- **Pago puntual** + uniforme incluido
- **Respuesta rápida** vía WhatsApp
- **Proceso gratuito** sin intermediarios

---

## ⚙️ Variables de Entorno

No se identifica archivo `.env` - la aplicación funciona sin configuración externa.

---

## 📝 Notas de Implementación

1. **Estado de Navegación:** Usa `useLocation().state` para pasar datos entre pasos
2. **Toasts:** Implementa notificaciones visuales con Sonner
3. **Confeti:** Componente decorativo con piezas animadas
4. **Archivos:** Uso de FileReader para previsualizaciones locales
5. **Forms:** Totalmente tipadas con TypeScript

---

## 🔍 Posibles Mejoras Identificadas

1. ✋ Sin integración de backend actual (TODO)
2. ✋ Sin persistencia de datos (localStorage/DB)
3. ✋ Sin validación de tipo de archivo
4. ✋ Sin límite de tamaño de archivo
5. ✋ Sin envío real de formularios
6. ✋ Sin authentication/authorization
7. ✋ Sin analytics
8. ✋ Sin sitemap o estructura SEO completa

---

## 📅 Período de Convocatoria

**16 - 20 de enero de 2026**

---

## 👨‍💻 Dependencias Clave por Función

| Función | Dependencias |
|---------|--------------|
| Formularios | react-hook-form, zod, @hookform/resolvers |
| UI Components | @radix-ui/*, shadcn/ui |
| Routing | react-router-dom |
| Estilos | tailwind, tailwind-merge, clsx |
| Notificaciones | sonner |
| Iconos | lucide-react |
| Queries | @tanstack/react-query |
| Build | vite, @vitejs/plugin-react-swc |
| Testing | vitest, @testing-library/* |

---

**Estado:** ✅ Análisis completado  
**Próximo Paso:** Preparado para implementar cambios  
**Protocolo:** Se creará README de cambios con cada modificación
