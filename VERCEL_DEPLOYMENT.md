# Despliegue en Vercel

Esta guía te explica cómo desplegar el proyecto en Vercel.

## Requisitos Previos

- Cuenta en [Vercel](https://vercel.com)
- Repositorio en GitHub, GitLab o Bitbucket
- Variables de entorno de Supabase configuradas

## Pasos para Desplegar

### 1. Conectar el Repositorio
1. Ve a [https://vercel.com/new](https://vercel.com/new)
2. Conecta tu repositorio (GitHub, GitLab o Bitbucket)
3. Selecciona este proyecto

### 2. Configurar Variables de Entorno
En el panel de Vercel, ve a **Settings** → **Environment Variables** y agrega:

```
VITE_SUPABASE_URL=tu_url_de_supabase
VITE_SUPABASE_ANON_KEY=tu_anon_key_de_supabase
```

Obtén estos valores de tu proyecto en [Supabase](https://supabase.com):
- Ve a **Settings** → **API**
- Copia la URL del proyecto
- Copia la clave `anon` pública

### 3. Configuración Automática
Vercel detectará automáticamente que es un proyecto Vite y:
- Usará `npm run build` como comando de construcción
- Publicará la carpeta `dist`
- Configurará las rutas correctamente

### 4. Desplegar
Simplemente haz push a tu rama principal:
```bash
git push origin main
```

Vercel detectará el cambio y desplegará automáticamente.

## Monitoreo

Una vez desplegado:
1. Verifica la URL de tu sitio en el dashboard de Vercel
2. Ve a **Deployments** para ver el historial
3. Ve a **Analytics** para ver el rendimiento
4. Ve a **Logs** para ver los errores en tiempo de ejecución

## Troubleshooting

### Build falló
- Verifica que las variables de entorno estén configuradas
- Revisa los logs de construcción en Vercel
- Asegúrate de que el comando `npm run build` funciona localmente

### Errors en Runtime
- Revisa los logs en la pestaña **Logs** del deployment
- Abre la consola del navegador (F12) para ver errores de cliente

### Problemas con Supabase
- Verifica que las credenciales sean correctas
- Asegúrate de que el proyecto Supabase está activo
- Revisa que el CORS esté configurado en Supabase si es necesario

## Variables de Entorno por Ambiente

Puedes configurar diferentes variables para Production, Preview y Development:

1. En **Settings** → **Environment Variables**
2. Selecciona el ambiente (Production, Preview, Development)
3. Agrega las variables correspondientes

## Información Adicional

- [Documentación de Vercel](https://vercel.com/docs)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
- [Supabase Documentation](https://supabase.com/docs)
