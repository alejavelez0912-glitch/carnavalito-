# 🆔 Cómo Obtener tu Chat ID de Telegram

## ⚡ Método Rápido (3 pasos)

### Paso 1: Envía un mensaje a tu bot
1. Abre Telegram
2. Busca tu bot (o crea uno nuevo con @BotFather si no lo tienes)
3. Envía cualquier mensaje al bot (por ejemplo: "Hola")

### Paso 2: Obtén el Chat ID

**Opción A - Herramienta Visual (Más Fácil):**
1. Con el servidor corriendo, abre: http://localhost:8080/telegram-helper.html
2. O sin servidor: Abre el archivo `public/telegram-helper.html` en tu navegador
3. Haz clic en el botón "🔍 Obtener Chat ID"
4. Copia el número que aparece

**Opción B - Manual:**
1. Abre en tu navegador esta URL:
   ```
   https://api.telegram.org/bot8558295711:AAFsLIQ_QyZFgLD7V11tVMntpKI-5QP207M/getUpdates
   ```
2. Busca en la respuesta JSON: `"chat":{"id":123456789}`
3. Copia el número (ese es tu Chat ID)

### Paso 3: Agrega el Chat ID al archivo .env.local

1. Abre el archivo `.env.local` en la raíz del proyecto
2. Agrega el Chat ID después del signo `=`:
   ```env
   VITE_TELEGRAM_BOT_TOKEN=8558295711:AAFsLIQ_QyZFgLD7V11tVMntpKI-5QP207M
   VITE_TELEGRAM_CHAT_ID=123456789
   ```
   (Reemplaza `123456789` con tu Chat ID real)

3. **REINICIA el servidor** (Ctrl+C y luego `npm run dev`)

## ✅ Verificación

Si todo está bien configurado, cuando completes el formulario deberías ver:
- ✅ Mensaje de éxito (no error)
- ✅ Notificación "📤 Enviando datos a Telegram..."
- ✅ Mensajes llegando a tu Telegram

## 🔧 Ejemplo de respuesta de getUpdates

```json
{
  "ok": true,
  "result": [
    {
      "update_id": 123456789,
      "message": {
        "message_id": 1,
        "from": {...},
        "chat": {
          "id": 123456789,  ← ESTE ES TU CHAT ID
          "first_name": "Tu Nombre",
          "type": "private"
        },
        "date": 1234567890,
        "text": "Hola"
      }
    }
  ]
}
```

## 💡 Para usar en un grupo

Si quieres recibir los mensajes en un grupo:

1. Crea un grupo en Telegram
2. Agrega el bot al grupo
3. Haz al bot **administrador**
4. Envía un mensaje al grupo
5. Obtén el Chat ID (será un número **negativo**, ej: `-1001234567890`)
6. Úsalo en `.env.local`

---

**¿Necesitas más ayuda?** Revisa `TELEGRAM_SETUP.md` para la documentación completa.
