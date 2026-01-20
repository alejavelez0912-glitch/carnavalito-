# 📱 Configuración de Telegram

Guía completa para conectar tu aplicación con Telegram Bot API.

## 🚀 Pasos de Configuración

### 1. Obtener el Chat ID

Tienes dos opciones para obtener tu Chat ID:

#### Opción A: Usando la herramienta HTML (Recomendado)

1. Abre el archivo `src/utils/telegram-helper.html` en tu navegador
2. Envía un mensaje a tu bot en Telegram (cualquier mensaje, ej: "Hola")
3. Haz clic en el botón "🔍 Obtener Chat ID"
4. Copia el Chat ID que aparece
5. Pégalo en el archivo `.env.local` (ver paso 2)

#### Opción B: Manualmente

1. Envía un mensaje a tu bot en Telegram
2. Abre esta URL en tu navegador (reemplaza `YOUR_BOT_TOKEN` con tu token):
   ```
   https://api.telegram.org/bot8558295711:AAFsLIQ_QyZFgLD7V11tVMntpKI-5QP207M/getUpdates
   ```
3. Busca en la respuesta JSON: `"chat":{"id":XXXXX}`
4. Copia el número (puede ser negativo si es un grupo)
5. Ese es tu Chat ID

### 2. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto con el siguiente contenido:

```env
VITE_TELEGRAM_BOT_TOKEN=8558295711:AAFsLIQ_QyZFgLD7V11tVMntpKI-5QP207M
VITE_TELEGRAM_CHAT_ID=TU_CHAT_ID_AQUI
```

**⚠️ IMPORTANTE:** 
- El archivo `.env.local` NO debe subirse a Git (ya está en `.gitignore`)
- Reemplaza `TU_CHAT_ID_AQUI` con el Chat ID que obtuviste en el paso 1
- Reinicia el servidor de desarrollo después de crear/modificar `.env.local`

### 3. Reiniciar el Servidor

Después de crear o modificar el archivo `.env.local`, debes reiniciar el servidor:

```bash
# Detén el servidor (Ctrl+C)
# Luego inícialo de nuevo
npm run dev
```

## 🧪 Probar la Integración

1. Asegúrate de que el servidor esté corriendo
2. Abre la aplicación en tu navegador
3. Completa el formulario del Paso 1 con datos de prueba
4. Revisa tu chat de Telegram - deberías recibir:
   - Un mensaje con los datos del formulario
   - Las fotos de la cédula (frente y reverso)

5. Completa el Paso 2
6. Revisa tu chat de Telegram - deberías recibir:
   - Un mensaje de confirmación del Paso 2
   - La hoja de vida (como documento)
   - La foto de rostro

## 🔧 Estructura de Mensajes

### Paso 1 - Mensaje de Registro
```
🎪 NUEVO REGISTRO - PASO 1 🎪

👤 Datos Personales:
Nombre: [Nombre]
Edad: [Edad] años
Cédula: [Cédula]
Barrio: [Barrio]
Estado Civil: [Estado]
Ocupación: [Ocupación]

ID Registro: [ID]

⏳ Esperando Paso 2 (Documentos y foto de rostro)
```

### Paso 2 - Mensaje de Confirmación
```
✅ PASO 2 COMPLETADO ✅

ID Registro: [ID]
Cédula: [Cédula]

📎 Documentos Enviados:
✓ Hoja de Vida
✓ Foto de Rostro

🎉 REGISTRO FINALIZADO
```

## 🐛 Solución de Problemas

### Error: "Variables de Telegram no configuradas"
- Verifica que el archivo `.env.local` existe en la raíz del proyecto
- Verifica que las variables están escritas correctamente (sin espacios alrededor del `=`)
- Reinicia el servidor de desarrollo

### Error: "Error enviando mensaje a Telegram"
- Verifica que el Bot Token es correcto
- Verifica que el Chat ID es correcto (puede ser negativo para grupos)
- Asegúrate de haber enviado al menos un mensaje al bot antes de usarlo
- Verifica que el bot tiene permisos para enviar mensajes

### Las fotos no se envían
- Verifica que los archivos no son demasiado grandes (máximo 20MB para Telegram)
- Verifica la conexión a internet
- Revisa la consola del navegador para ver errores específicos

### El bot no recibe mensajes
- Asegúrate de haber iniciado una conversación con el bot en Telegram
- Verifica que el Chat ID es correcto
- Si estás usando un grupo, asegúrate de que el bot está agregado como administrador

## 📚 Recursos

- [Documentación de Telegram Bot API](https://core.telegram.org/bots/api)
- [Crear un bot con @BotFather](https://core.telegram.org/bots/tutorial)
- [getUpdates API](https://core.telegram.org/bots/api#getupdates)

## 🔐 Seguridad

- **NUNCA** compartas tu Bot Token públicamente
- **NUNCA** subas el archivo `.env.local` a Git
- Si tu token se compromete, revócalo en @BotFather y genera uno nuevo
- Usa variables de entorno para todas las configuraciones sensibles

## 💡 Tips

- Para recibir notificaciones en un grupo de Telegram:
  1. Crea un grupo
  2. Agrega el bot como miembro
  3. Haz al bot administrador
  4. Envía un mensaje al grupo
  5. Usa el Chat ID del grupo (será un número negativo)

- Para desarrollo, puedes crear un grupo privado de Telegram solo para recibir los registros
- Los mensajes en Telegram tienen un límite de tamaño: 4096 caracteres para texto, 20MB para archivos
