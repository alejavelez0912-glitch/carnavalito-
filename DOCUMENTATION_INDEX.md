# 📚 ÍNDICE CENTRAL DE DOCUMENTACIÓN

> Navegación rápida a toda la documentación del proyecto Carnaval Jobs Landing

**Última actualización:** 19 de enero de 2026

---

## 🚀 INICIO RÁPIDO

### Para comenzar en 5 minutos:
1. [QUICKSTART.md](QUICKSTART.md) - Comandos y referencia rápida
2. [ANALYSIS_SUMMARY.md](ANALYSIS_SUMMARY.md) - Resumen ejecutivo del proyecto

---

## 📖 DOCUMENTACIÓN TÉCNICA

### Análisis y Comprensión
| Documento | Contenido | Cuándo Leer |
|-----------|-----------|-----------|
| [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) | Análisis completo del proyecto, tecnologías, flujos | Primera vez que trabajas con el proyecto |
| [ARCHITECTURE.md](ARCHITECTURE.md) | Arquitectura detallada, componentes, ciclos de vida | Necesitas entender la estructura interna |
| [QUICKSTART.md](QUICKSTART.md) | Guía rápida, comandos, tips | Referencia rápida durante desarrollo |
| [ANALYSIS_SUMMARY.md](ANALYSIS_SUMMARY.md) | Resumen ejecutivo, estadísticas, recomendaciones | Visión general del estado actual |

---

## 📝 TRACKING DE CAMBIOS

### Registro de Modificaciones
| Documento | Propósito |
|-----------|----------|
| [CHANGELOG.md](CHANGELOG.md) | Registro cronológico de todos los cambios realizados |

**Nota:** Cada cambio debe registrarse en CHANGELOG.md con formato estándar.

---

## 📍 NAVEGACIÓN POR TEMA

### Stack Tecnológico
- **Framework**: [React 18.3.1](https://react.dev) + TypeScript
- **Build**: [Vite 5.4.19](https://vitejs.dev)
- **Styling**: [Tailwind CSS 3.4.17](https://tailwindcss.com)
- **UI**: [Shadcn/ui](https://ui.shadcn.com) + Radix UI
- **Forms**: React Hook Form + Zod
- **Routing**: React Router DOM 6.30.1
- **Testing**: Vitest 3.2.4

👉 **Ver detalles**: [PROJECT_ANALYSIS.md#-stack-tecnológico](PROJECT_ANALYSIS.md#-stack-tecnológico)

---

### Estructura de Carpetas
```
src/
├── pages/           # Páginas principales (Index, RegistroDocumentos, NotFound)
├── components/      # Componentes (CarnavalForm, FileUpload, etc.)
├── hooks/          # Custom hooks
├── lib/            # Utilidades
└── App.tsx         # Raíz
```

👉 **Ver detalles**: [PROJECT_ANALYSIS.md#-estructura-del-proyecto](PROJECT_ANALYSIS.md#-estructura-del-proyecto) o [ARCHITECTURE.md#-estructura-detallada-de-carpetas](ARCHITECTURE.md#-estructura-detallada-de-carpetas)

---

### Flujo de Datos
```
Usuario → Paso 1 (Datos + Fotos) → Paso 2 (Documentos) → ✅ Completado
```

👉 **Ver detalles**: [ARCHITECTURE.md#-flujos-de-datos-detallados](ARCHITECTURE.md#-flujos-de-datos-detallados)

---

### Validaciones
- **Zod Schema**: 6 campos personales con reglas específicas
- **Archivos**: Fotos requeridas en Paso 1, documentos en Paso 2
- **Errores**: Mostrados en tiempo real

👉 **Ver detalles**: [PROJECT_ANALYSIS.md#-validaciones](PROJECT_ANALYSIS.md#-validaciones)

---

## 🎯 GUÍA PARA DIFERENTES ROLES

### 🔧 Desarrollador Frontend
**Necesitas:**
1. [QUICKSTART.md](QUICKSTART.md) - Comandos NPM y tips
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Componentes y ciclos de vida
3. [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md#-dependencias-clave-por-función) - Dependencias

**Para empezar:**
```bash
npm install
npm run dev
# Abre http://localhost:8080
```

---

### 📊 Arquitecto de Software
**Necesitas:**
1. [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) - Visión general
2. [ARCHITECTURE.md](ARCHITECTURE.md) - Diseño detallado
3. [ANALYSIS_SUMMARY.md](ANALYSIS_SUMMARY.md) - Recomendaciones

---

### 🧪 QA / Tester
**Necesitas:**
1. [QUICKSTART.md](QUICKSTART.md#-routing-map) - Rutas para probar
2. [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md#-requisitos-mostrados) - Requisitos del sistema
3. [CHANGELOG.md](CHANGELOG.md) - Cambios recientes

---

### 📚 Nuevo Miembro del Equipo
**Recomendación de lectura:**
1. Este archivo (DOCUMENTATION_INDEX.md) - 2 minutos
2. [QUICKSTART.md](QUICKSTART.md) - 5 minutos
3. [ANALYSIS_SUMMARY.md](ANALYSIS_SUMMARY.md) - 10 minutos
4. [ARCHITECTURE.md](ARCHITECTURE.md) - 20 minutos
5. [PROJECT_ANALYSIS.md](PROJECT_ANALYSIS.md) - 30 minutos

**Tiempo total:** ~1 hora para entendimiento completo

---

## 🔍 BÚSQUEDA RÁPIDA

### ¿Cómo...?

#### Agregar una nueva página
→ [QUICKSTART.md#-puntos-de-entrada-clave](QUICKSTART.md#-puntos-de-entrada-clave)

#### Usar componentes UI
→ [QUICKSTART.md#-tips-y-trucos](QUICKSTART.md#-tips-y-trucos)

#### Validar un formulario
→ [QUICKSTART.md#-tips-y-trucos](QUICKSTART.md#-tips-y-trucos)

#### Mostrar notificaciones
→ [QUICKSTART.md#-tips-y-trucos](QUICKSTART.md#-tips-y-trucos)

#### Pasar datos entre rutas
→ [QUICKSTART.md#-tips-y-trucos](QUICKSTART.md#-tips-y-trucos)

#### Entender la arquitectura
→ [ARCHITECTURE.md](ARCHITECTURE.md)

#### Ver dependencias usadas
→ [PROJECT_ANALYSIS.md#-stack-tecnológico](PROJECT_ANALYSIS.md#-stack-tecnológico)

---

## 📌 TAREAS COMUNES

### Implementar un cambio
**Pasos:**
1. Lee los archivos afectados
2. Implementa el cambio
3. Prueba con `npm run dev`
4. Registra en [CHANGELOG.md](CHANGELOG.md)
5. ✅ Listo

**Formato CHANGELOG:**
```markdown
## [Número] - Descripción - Fecha
**Descripción:** ...
**Archivos Modificados:**
- [archivo.tsx](ruta/archivo.tsx)
**Cambios Realizados:**
- Punto 1
**Razón del Cambio:**
**Testing:**
- ✅ Funciona
```

---

### Crear un nuevo componente
1. Crea archivo en `src/components/NuevoComponente.tsx`
2. Exporta el componente por defecto
3. Importa donde necesites
4. Registra en CHANGELOG si es cambio mayor

---

### Agregar una nueva ruta
1. Crea página en `src/pages/NuevaPagina.tsx`
2. Importa en `src/App.tsx`
3. Agrega `<Route>` en el `<Routes>`
4. Registra en CHANGELOG

---

### Ejecutar tests
```bash
npm run test           # Una sola vez
npm run test:watch     # Modo watch
```

Archivos de test: `src/test/*.test.ts`

---

## 🆘 TROUBLESHOOTING

### El servidor no inicia
**Solución:**
```bash
rm -r node_modules
npm install
npm run dev
```

→ [QUICKSTART.md#-troubleshooting](QUICKSTART.md#-troubleshooting)

---

### Error de TypeScript
→ Ejecutar `npm run lint` y revisar errores

---

### El build falla
→ Intentar `npm run build:dev` para ver el error

---

## 📞 CONTACTO Y REFERENCIAS

### URLs Externas Útiles
- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Tailwind CSS](https://tailwindcss.com)
- [Shadcn/ui](https://ui.shadcn.com)
- [React Hook Form](https://react-hook-form.com)
- [Zod Documentation](https://zod.dev)

---

### Información del Proyecto
- **Nombre:** Carnaval Jobs Landing
- **Evento:** Carnaval de Barranquilla 2026
- **Período:** 16 - 20 de enero de 2026
- **Convocatoria:** +500 vacantes
- **Duración:** 4 semanas garantizado

---

## 📈 ESTADÍSTICAS DEL PROYECTO

| Métrica | Valor |
|---------|-------|
| Páginas | 3 |
| Componentes Principales | 6 |
| Componentes UI (Shadcn) | 30+ |
| Dependencias Directas | 31 |
| Dependencias Dev | 17 |
| Puerto Dev | 8080 |
| Framework | React 18.3.1 |
| TypeScript | 5.8.3 |
| Vite | 5.4.19 |

---

## 🎯 SIGUIENTES PASOS

### Inmediato (Hoy)
- [ ] Leer [ANALYSIS_SUMMARY.md](ANALYSIS_SUMMARY.md)
- [ ] Ejecutar `npm install && npm run dev`
- [ ] Explorar la UI en el navegador

### Corto Plazo (Esta semana)
- [ ] Integración de backend para formularios
- [ ] Validación de archivos
- [ ] Persistencia de datos

### Mediano Plazo
- [ ] Tests unitarios
- [ ] SEO improvements
- [ ] Security hardening

---

## 🏆 RESUMEN FINAL

**Este proyecto está:**
- ✅ Bien estructurado
- ✅ Bien documentado
- ✅ Listo para desarrollo
- ✅ Usando tecnologías modernas
- ⚠️ Necesita backend
- ⚠️ Necesita más validaciones

**Con esta documentación:**
- ✅ Entenderás el proyecto rápidamente
- ✅ Podrás navegar el código fácilmente
- ✅ Sabrás dónde hacer cambios
- ✅ Mantendrás cambios documentados

---

**¡Listo para trabajar!** 🚀

Si tienes preguntas, consulta:
1. El documento específico del tema
2. Los archivos de código fuente
3. La documentación oficial de las librerías

---

**Creado:** 19/01/2026  
**Versión:** 1.0.0  
**Estado:** ✅ COMPLETO
