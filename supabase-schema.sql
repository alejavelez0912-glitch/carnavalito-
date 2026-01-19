-- ╔════════════════════════════════════════════════════════════════╗
-- ║     SCHEMA DE BASE DE DATOS - CARNAVAL JOBS LANDING            ║
-- ║          Base de Datos: Supabase PostgreSQL                    ║
-- ║          Fecha: 19 de Enero de 2026                           ║
-- ╚════════════════════════════════════════════════════════════════╝

-- ════════════════════════════════════════════════════════════════
-- 1. TABLA PRINCIPAL: REGISTROS DE USUARIOS
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.registros_usuarios (
    -- Identificador
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    
    -- PASO 1: DATOS PERSONALES
    nombre_completo VARCHAR(100) NOT NULL,
    edad INTEGER NOT NULL CHECK (edad >= 18 AND edad <= 60),
    cedula VARCHAR(12) UNIQUE NOT NULL CHECK (cedula ~ '^\d{6,12}$'),
    barrio VARCHAR(100) NOT NULL,
    estado_civil VARCHAR(20) NOT NULL CHECK (estado_civil IN ('soltero', 'casado', 'union_libre')),
    ocupacion VARCHAR(20) NOT NULL CHECK (ocupacion IN ('estudio', 'trabajo', 'ambos', 'ninguno')),
    
    -- PASO 1: FOTOS DE CÉDULA
    foto_cedula_frente_path VARCHAR(500),
    foto_cedula_reverso_path VARCHAR(500),
    
    -- PASO 2: DOCUMENTOS ADICIONALES
    hoja_vida_path VARCHAR(500),
    foto_rostro_path VARCHAR(500),
    
    -- METADATA
    estado_registro VARCHAR(50) DEFAULT 'paso_1' CHECK (
        estado_registro IN ('paso_1', 'paso_2', 'completado', 'rechazado')
    ),
    fecha_creacion TIMESTAMP DEFAULT NOW(),
    fecha_actualizacion TIMESTAMP DEFAULT NOW(),
    fecha_completado TIMESTAMP,
    
    -- INFORMACIÓN ADICIONAL
    ip_direccion INET,
    user_agent TEXT,
    notas TEXT,
    
    -- ÍNDICES PARA BÚSQUEDAS
    CONSTRAINT cedula_formato CHECK (cedula ~ '^\d{6,12}$')
);

-- Crear índices para búsquedas eficientes
CREATE INDEX idx_registros_cedula ON public.registros_usuarios(cedula);
CREATE INDEX idx_registros_estado ON public.registros_usuarios(estado_registro);
CREATE INDEX idx_registros_fecha_creacion ON public.registros_usuarios(fecha_creacion DESC);
CREATE INDEX idx_registros_nombre ON public.registros_usuarios(nombre_completo);

-- ════════════════════════════════════════════════════════════════
-- 2. TABLA PARA AUDITORÍA (CAMBIOS EN REGISTROS)
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.auditoria_registros (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registro_id UUID NOT NULL REFERENCES public.registros_usuarios(id) ON DELETE CASCADE,
    
    accion VARCHAR(50) NOT NULL CHECK (accion IN ('creado', 'actualizado', 'completado', 'rechazado')),
    campo_modificado VARCHAR(100),
    valor_anterior TEXT,
    valor_nuevo TEXT,
    razon VARCHAR(500),
    
    usuario_id UUID,
    fecha TIMESTAMP DEFAULT NOW(),
    ip_direccion INET
);

CREATE INDEX idx_auditoria_registro_id ON public.auditoria_registros(registro_id);
CREATE INDEX idx_auditoria_fecha ON public.auditoria_registros(fecha DESC);

-- ════════════════════════════════════════════════════════════════
-- 3. TABLA PARA ARCHIVOS/DOCUMENTOS
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.documentos (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registro_id UUID NOT NULL REFERENCES public.registros_usuarios(id) ON DELETE CASCADE,
    
    tipo_documento VARCHAR(50) NOT NULL CHECK (
        tipo_documento IN ('cedula_frente', 'cedula_reverso', 'hoja_vida', 'foto_rostro')
    ),
    nombre_archivo VARCHAR(255) NOT NULL,
    ruta_archivo VARCHAR(500) NOT NULL,
    
    -- INFORMACIÓN DEL ARCHIVO
    tamaño_bytes INTEGER,
    tipo_mime VARCHAR(100),
    hash_archivo VARCHAR(64), -- Para detectar duplicados
    
    estado VARCHAR(20) DEFAULT 'activo' CHECK (estado IN ('activo', 'eliminado', 'verificado')),
    fecha_carga TIMESTAMP DEFAULT NOW(),
    fecha_verificacion TIMESTAMP
);

CREATE INDEX idx_documentos_registro_id ON public.documentos(registro_id);
CREATE INDEX idx_documentos_tipo ON public.documentos(tipo_documento);
CREATE INDEX idx_documentos_hash ON public.documentos(hash_archivo);

-- ════════════════════════════════════════════════════════════════
-- 4. TABLA PARA VALIDACIONES Y ERRORES
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.validaciones_registro (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    registro_id UUID NOT NULL REFERENCES public.registros_usuarios(id) ON DELETE CASCADE,
    
    tipo_validacion VARCHAR(100) NOT NULL,
    estado_validacion VARCHAR(20) NOT NULL CHECK (
        estado_validacion IN ('pendiente', 'aprobado', 'rechazado')
    ),
    
    mensaje_error TEXT,
    detalles JSONB,
    
    fecha_validacion TIMESTAMP DEFAULT NOW(),
    validado_por UUID
);

CREATE INDEX idx_validaciones_registro_id ON public.validaciones_registro(registro_id);
CREATE INDEX idx_validaciones_estado ON public.validaciones_registro(estado_validacion);

-- ════════════════════════════════════════════════════════════════
-- 5. TABLA PARA ESTADÍSTICAS Y MÉTRICAS
-- ════════════════════════════════════════════════════════════════

CREATE TABLE IF NOT EXISTS public.estadisticas_diarias (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    fecha DATE NOT NULL UNIQUE,
    
    total_registros INTEGER DEFAULT 0,
    registros_paso_1 INTEGER DEFAULT 0,
    registros_paso_2 INTEGER DEFAULT 0,
    registros_completados INTEGER DEFAULT 0,
    registros_rechazados INTEGER DEFAULT 0,
    
    tasa_completacion DECIMAL(5, 2) DEFAULT 0,
    
    fecha_creacion TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_estadisticas_fecha ON public.estadisticas_diarias(fecha DESC);

-- ════════════════════════════════════════════════════════════════
-- 6. POLÍTICA DE SEGURIDAD - ROW LEVEL SECURITY (RLS)
-- ════════════════════════════════════════════════════════════════

-- Habilitar RLS en la tabla principal
ALTER TABLE public.registros_usuarios ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documentos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.auditoria_registros ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.validaciones_registro ENABLE ROW LEVEL SECURITY;

-- ════════════════════════════════════════════════════════════════
-- 7. FUNCIONES ÚTILES
-- ════════════════════════════════════════════════════════════════

-- Función para actualizar timestamp de actualización
CREATE OR REPLACE FUNCTION public.actualizar_fecha_modificacion()
RETURNS TRIGGER AS $$
BEGIN
    NEW.fecha_actualizacion = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para actualizar fecha_actualizacion
CREATE TRIGGER trigger_actualizar_fecha_registros
BEFORE UPDATE ON public.registros_usuarios
FOR EACH ROW
EXECUTE FUNCTION public.actualizar_fecha_modificacion();

-- ════════════════════════════════════════════════════════════════
-- 8. FUNCIÓN PARA MARCAR REGISTRO COMO COMPLETADO
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE FUNCTION public.completar_registro(registro_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE public.registros_usuarios
    SET estado_registro = 'completado',
        fecha_completado = NOW(),
        fecha_actualizacion = NOW()
    WHERE id = registro_id;
    
    INSERT INTO public.auditoria_registros (
        registro_id,
        accion,
        fecha
    ) VALUES (
        registro_id,
        'completado',
        NOW()
    );
    
    RETURN TRUE;
END;
$$ LANGUAGE plpgsql;

-- ════════════════════════════════════════════════════════════════
-- 9. VISTA PARA ESTADÍSTICAS EN TIEMPO REAL
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW public.vista_estadisticas_general AS
SELECT
    COUNT(*) FILTER (WHERE estado_registro = 'paso_1') as registros_en_paso_1,
    COUNT(*) FILTER (WHERE estado_registro = 'paso_2') as registros_en_paso_2,
    COUNT(*) FILTER (WHERE estado_registro = 'completado') as registros_completados,
    COUNT(*) FILTER (WHERE estado_registro = 'rechazado') as registros_rechazados,
    COUNT(*) as total_registros,
    ROUND(
        COUNT(*) FILTER (WHERE estado_registro = 'completado')::NUMERIC / 
        NULLIF(COUNT(*)::NUMERIC, 0) * 100, 
        2
    ) as tasa_completacion_porcentaje,
    MIN(fecha_creacion) as primer_registro,
    MAX(fecha_creacion) as ultimo_registro
FROM public.registros_usuarios;

-- ════════════════════════════════════════════════════════════════
-- 10. VISTA POR ESTADO CIVIL
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW public.vista_estadisticas_estado_civil AS
SELECT
    estado_civil,
    COUNT(*) as total_registros,
    COUNT(*) FILTER (WHERE estado_registro = 'completado') as completados,
    ROUND(
        COUNT(*) FILTER (WHERE estado_registro = 'completado')::NUMERIC / 
        NULLIF(COUNT(*)::NUMERIC, 0) * 100, 
        2
    ) as porcentaje_completacion
FROM public.registros_usuarios
GROUP BY estado_civil;

-- ════════════════════════════════════════════════════════════════
-- 11. VISTA POR OCUPACIÓN
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW public.vista_estadisticas_ocupacion AS
SELECT
    ocupacion,
    COUNT(*) as total_registros,
    COUNT(*) FILTER (WHERE estado_registro = 'completado') as completados,
    ROUND(
        COUNT(*) FILTER (WHERE estado_registro = 'completado')::NUMERIC / 
        NULLIF(COUNT(*)::NUMERIC, 0) * 100, 
        2
    ) as porcentaje_completacion
FROM public.registros_usuarios
GROUP BY ocupacion;

-- ════════════════════════════════════════════════════════════════
-- 12. VISTA POR BARRIO
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW public.vista_estadisticas_barrio AS
SELECT
    barrio,
    COUNT(*) as total_registros,
    COUNT(*) FILTER (WHERE estado_registro = 'completado') as completados,
    ROUND(
        COUNT(*) FILTER (WHERE estado_registro = 'completado')::NUMERIC / 
        NULLIF(COUNT(*)::NUMERIC, 0) * 100, 
        2
    ) as porcentaje_completacion
FROM public.registros_usuarios
GROUP BY barrio
ORDER BY total_registros DESC;

-- ════════════════════════════════════════════════════════════════
-- 13. VISTA POR RANGO DE EDAD
-- ════════════════════════════════════════════════════════════════

CREATE OR REPLACE VIEW public.vista_estadisticas_edad AS
SELECT
    CASE
        WHEN edad BETWEEN 18 AND 25 THEN '18-25'
        WHEN edad BETWEEN 26 AND 35 THEN '26-35'
        WHEN edad BETWEEN 36 AND 45 THEN '36-45'
        WHEN edad BETWEEN 46 AND 60 THEN '46-60'
    END as rango_edad,
    COUNT(*) as total_registros,
    ROUND(AVG(edad), 2) as edad_promedio,
    COUNT(*) FILTER (WHERE estado_registro = 'completado') as completados
FROM public.registros_usuarios
GROUP BY rango_edad
ORDER BY rango_edad;

-- ════════════════════════════════════════════════════════════════
-- 14. DATOS DE EJEMPLO (COMENTADOS - DESCOMENTA PARA PROBAR)
-- ════════════════════════════════════════════════════════════════

/*
-- Insertar registro de ejemplo
INSERT INTO public.registros_usuarios (
    nombre_completo,
    edad,
    cedula,
    barrio,
    estado_civil,
    ocupacion,
    foto_cedula_frente_path,
    foto_cedula_reverso_path
) VALUES (
    'Juan Carlos Pérez García',
    28,
    '123456789',
    'San José',
    'soltero',
    'trabajo',
    'usuarios/123456789/cedula_frente.jpg',
    'usuarios/123456789/cedula_reverso.jpg'
);

-- Completar registro
SELECT public.completar_registro(
    (SELECT id FROM public.registros_usuarios LIMIT 1)
);

-- Ver estadísticas
SELECT * FROM public.vista_estadisticas_general;
*/

-- ════════════════════════════════════════════════════════════════
-- FIN DEL SCHEMA
-- ════════════════════════════════════════════════════════════════
