# 🎉 Carnaval Jobs Landing

> **Landing page de inscripción para el Carnaval de Barranquilla 2026**

Plataforma de reclutamiento para oportunidades laborales en el evento cultural más grande de Colombia.

---

## ⚡ Estado Actual (v2.0)

✅ **Frontend React completamente funcional**  
✅ **Base de datos PostgreSQL diseñada**  
✅ **Cliente Supabase TypeScript listo**  
✅ **13+ documentos de guía**  

⏳ **Supabase project (crear manualmente - 5 min)**  
⏳ **React integration hooks (crear desde template - 20 min)**  
⏳ **Testing completo (validar manualmente - 15 min)**  

👉 **[Instrucciones de Inicio](LEEME_PRIMERO.txt) | [Estado Detallado](ESTADO_DEL_PROYECTO.md)**

---

## 🚀 Inicio Rápido

```bash
# 1. Instalar dependencias (si es primera vez)
npm install

# 2. Crear archivo .env.local con credenciales Supabase
# (Ver SUPABASE_CHECKLIST.md FASE 4)

# 3. Iniciar servidor de desarrollo
npm run dev

# 4. Abrir navegador
# http://localhost:5173
```

## 📚 Documentación (Elige tu ruta)

### 🔰 Soy **NUEVO en el proyecto** (15 min)
1. [START_HERE.md](START_HERE.md) - 1 minuto intro
2. [ESTADO_DEL_PROYECTO.md](ESTADO_DEL_PROYECTO.md) - 10 minutos resumen

### 🚀 Quiero **IMPLEMENTAR SUPABASE** (2 horas)
👉 [SUPABASE_CHECKLIST.md](SUPABASE_CHECKLIST.md) - 13 fases paso-a-paso

### 💻 Soy **DESARROLLADOR** (búsqueda rápida)
- Códigos SQL/TypeScript: [SUPABASE_COMANDOS.md](SUPABASE_COMANDOS.md)
- Integración React: [SUPABASE_INTEGRATION.md](SUPABASE_INTEGRATION.md)
- Diagramas: [SUPABASE_ARCHITECTURE.md](SUPABASE_ARCHITECTURE.md)

### 📊 Soy **PM/LÍDER** (resumen ejecutivo)
👉 [ESTADO_DEL_PROYECTO.md](ESTADO_DEL_PROYECTO.md) + [CHANGELOG.md](CHANGELOG.md)

### 🗺️ Quiero **NAVEGAR LA DOCUMENTACIÓN**
👉 [INDICE_DOCUMENTACION.md](INDICE_DOCUMENTACION.md) - Mapa completo

---

## 📋 Scripts Disponibles

```bash
npm run dev          # Dev server (http://localhost:5173)
npm run build        # Build producción
npm run build:dev    # Build desarrollo
npm run lint         # Verificar código
npm run preview      # Preview del build
npm run test         # Ejecutar tests
npm run test:watch   # Tests en modo watch
```

---

## 🎯 Características Principales

### ✅ Paso 1: Datos Personales + Cédula
- Formulario con validación Zod
- Campos: Nombre, edad, cédula, barrio, estado civil, ocupación
- Carga de fotos (frente y reverso de cédula)
- Validaciones en tiempo real

### ✅ Paso 2: Documentos Adicionales
- Carga de hoja de vida
- Foto del rostro
- Navegación entre pasos preservando datos

### ✅ UI/UX
- Diseño responsivo mobile-first
- Animación de confeti de fondo
- Notificaciones toast (Sonner)
- Componentes accesibles (Shadcn/ui + Radix)

---

## 🛠️ Stack Tecnológico

### Frontend
- **React** 18.3.1
- **TypeScript** 5.8.3
- **Vite** 5.4.19
- **Tailwind CSS** 3.4.17

### UI & Components
- **Shadcn/ui** - Componentes accesibles
- **Radix UI** - Primitivos sin estilos
- **Lucide React** - Iconografía

### Forms & Validation
- **React Hook Form** - Gestión de formularios
- **Zod** - Validación de esquemas
- **@hookform/resolvers** - Integración validadores

### Routing & State
- **React Router DOM** 6.30.1 - Routing
- **TanStack React Query** - Estado asincrónico

### Otros
- **Sonner** - Notificaciones toast
- **Next Themes** - Soporte temas
- **Date FNS** - Manipulación fechas
- **Recharts** - Gráficos

---

## 📁 Estructura del Proyecto

```
src/
├── pages/
│   ├── Index.tsx                 # Paso 1: Datos personales
│   ├── RegistroDocumentos.tsx    # Paso 2: Documentos
│   └── NotFound.tsx              # Página 404
├── components/
│   ├── CarnavalForm.tsx          # Formulario principal
│   ├── FileUpload.tsx            # Componente carga archivos
│   ├── HeroSection.tsx           # Banner principal
│   ├── TrustSection.tsx          # Beneficios
│   ├── ConfettiBackground.tsx    # Animación
│   ├── Footer.tsx                # Pie de página
│   └── ui/                       # 30+ componentes Shadcn
├── hooks/
├── lib/
│   └── utils.ts                  # Utilidades
├── App.tsx                       # Router principal
└── main.tsx                      # Punto entrada
```

---

## 🔐 Validaciones

### Paso 1: Datos Personales
- **Nombre**: 3-100 caracteres
- **Edad**: 18-60 años
- **Cédula**: 6-12 dígitos
- **Barrio**: 2-100 caracteres
- **Estado Civil**: soltero | casado | unión libre
- **Ocupación**: estudio | trabajo | ambos | ninguno

### Archivos
- **Foto Cédula (frente y reverso)**: Requerida
- **Hoja de Vida**: Requerida (Paso 2)
- **Foto Rostro**: Requerida (Paso 2)

---

## 🌐 Rutas Disponibles

| Ruta | Descripción |
|------|-------------|
| `/` | Página principal - Paso 1 (datos + cédula) |
| `/registro-documentos` | Paso 2 (documentos) |
| `*` | Página 404 |

---

## 🎨 Diseño

### Identidad Carnaval
- Colores festivos: amarillo, verde, rojo, naranja, púrpura
- Fuentes display para títulos
- Gradientes personalizados
- Animación de confeti

### Responsividad
- Mobile-first approach
- Breakpoints: sm (640px), md (1024px)
- Contenedor máximo: 512px (lg)

---

## ⚙️ Configuración

### Dev Server
- **Host**: `::`  (IPv6)
- **Puerto**: 8080
- **HMR**: Activado sin overlay

### Alias
```typescript
@ = ./src
```

---

## 📊 Convocatoria 2026

- **Período**: 16 - 20 de enero de 2026
- **Vacantes**: +500
- **Duración**: 4 semanas garantizado
- **Requisitos**:
  - Mayor de 18 años
  - Residente en Barranquilla
  - Disponibilidad Pre-Carnaval y Carnaval
  - Capacitación presencial (5 horas)

---

## 🧪 Testing

```bash
npm run test          # Tests una vez
npm run test:watch    # Tests en watch mode
```

**Framework**: Vitest 3.2.4

---

## ⚠️ Estado Actual & TODOs

### ✅ Implementado
- Formularios con validación
- Carga de archivos
- Routing entre pasos
- UI responsiva
- Notificaciones

### 📋 Pendiente
- [ ] Integración de backend
- [ ] Persistencia de datos
- [ ] Validación de tamaño/tipo archivo
- [ ] System de autenticación
- [ ] Dashboard admin
- [ ] Email confirmación
- [ ] Analytics
- [ ] SEO optimization

---

## 🤝 Cómo Contribuir

1. Consultar [QUICKSTART.md](QUICKSTART.md) para referencia rápida
2. Revisar [ARCHITECTURE.md](ARCHITECTURE.md) para entender la arquitectura
3. Ver [CHANGELOG.md](CHANGELOG.md) para entender cambios previos
4. Implementar cambios y crear entrada en CHANGELOG.md

---

## 📄 Licencia

Este proyecto es propiedad del Carnaval de Barranquilla 2026.

---

## 📞 Contacto

Para preguntas sobre inscripción: 
- WhatsApp: Respuesta rápida vía WhatsApp
- Período: 16 - 20 de enero de 2026

---

**Última actualización**: 19/01/2026  
**Versión**: 1.0.0
