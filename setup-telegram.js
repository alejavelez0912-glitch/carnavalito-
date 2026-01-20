#!/usr/bin/env node

/**
 * Script de configuración rápida para Telegram
 * Ejecuta: node setup-telegram.js
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const BOT_TOKEN = '8558295711:AAFsLIQ_QyZFgLD7V11tVMntpKI-5QP207M';

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function main() {
  console.log('\n═══════════════════════════════════════════════════════════════');
  console.log('  🚀 CONFIGURACIÓN DE TELEGRAM - CARNAVAL JOBS');
  console.log('═══════════════════════════════════════════════════════════════\n');

  const envPath = path.join(process.cwd(), '.env.local');
  
  // Verificar si ya existe
  if (fs.existsSync(envPath)) {
    console.log('⚠️  El archivo .env.local ya existe.');
    const overwrite = await question('¿Deseas sobrescribirlo? (s/n): ');
    if (overwrite.toLowerCase() !== 's') {
      console.log('❌ Operación cancelada.');
      rl.close();
      return;
    }
  }

  console.log('📋 Token del bot: ' + BOT_TOKEN);
  console.log('\n📝 Para obtener el Chat ID:');
  console.log('   1. Envía un mensaje a tu bot en Telegram');
  console.log('   2. Visita: https://api.telegram.org/bot' + BOT_TOKEN + '/getUpdates');
  console.log('   3. Busca "chat":{"id":XXXXX} en la respuesta\n');

  let chatId = await question('Ingresa el Chat ID: ');
  chatId = chatId.trim();

  if (!chatId) {
    console.log('❌ Chat ID no puede estar vacío.');
    rl.close();
    return;
  }

  // Crear contenido del archivo
  const envContent = `# Telegram Bot Configuration
# Generado automáticamente por setup-telegram.js
VITE_TELEGRAM_BOT_TOKEN=${BOT_TOKEN}
VITE_TELEGRAM_CHAT_ID=${chatId}
`;

  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('\n✅ Archivo .env.local creado exitosamente!');
    console.log('\n📁 Ubicación: ' + envPath);
    console.log('\n⚠️  IMPORTANTE: Reinicia el servidor de desarrollo (Ctrl+C y luego npm run dev)');
    console.log('\n🎉 ¡Configuración completada!');
  } catch (error) {
    console.error('❌ Error al crear el archivo:', error.message);
  }

  rl.close();
}

main().catch(console.error);
