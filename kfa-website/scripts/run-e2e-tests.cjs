#!/usr/bin/env node

const { spawn, execSync } = require('child_process');
const path = require('path');

const PORT = 3000;

console.log('🚀 Подготовка к запуску E2E тестов...\n');

// 1. Освобождаем порт
console.log('1️⃣ Освобождение порта...');
try {
  execSync(`node ${path.join(__dirname, 'kill-port.cjs')} ${PORT}`, { stdio: 'inherit' });
} catch (error) {
  console.log('Порт уже свободен');
}

// Небольшая пауза для освобождения ресурсов
setTimeout(() => {
  console.log('\n2️⃣ Запуск dev сервера на порту 3000...');

  // 2. Запускаем dev сервер
  const devServer = spawn('npm', ['run', 'dev'], {
    cwd: path.join(__dirname, '..'),
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe'],
  });

  let serverReady = false;

  devServer.stdout.on('data', (data) => {
    const output = data.toString();
    console.log(output);

    // Проверяем, что сервер запущен
    if (output.includes('Local:') || output.includes('localhost:3000') || output.includes('ready')) {
      if (!serverReady) {
        serverReady = true;
        console.log('\n✅ Dev сервер готов!\n');

        // Небольшая пауза для полной инициализации
        setTimeout(() => {
          console.log('3️⃣ Запуск E2E тестов...\n');

          // 3. Запускаем тесты
          const testArgs = process.argv.slice(2);
          const testCommand = testArgs.length > 0 ? ['run', 'test:e2e', '--', ...testArgs] : ['run', 'test:e2e', '--', 'cms-news.spec.ts'];

          const tests = spawn('npm', testCommand, {
            cwd: path.join(__dirname, '..'),
            shell: true,
            stdio: 'inherit',
          });

          tests.on('close', (code) => {
            console.log(`\n✨ Тесты завершены с кодом: ${code}\n`);

            // Останавливаем dev сервер
            console.log('4️⃣ Остановка dev сервера...');
            devServer.kill();

            process.exit(code);
          });
        }, 3000);
      }
    }
  });

  devServer.stderr.on('data', (data) => {
    console.error(data.toString());
  });

  devServer.on('error', (error) => {
    console.error('❌ Ошибка запуска dev сервера:', error);
    process.exit(1);
  });

  // Обработка прерывания
  process.on('SIGINT', () => {
    console.log('\n\n⚠️ Прерывание... Остановка процессов...');
    devServer.kill();
    process.exit(0);
  });
}, 1000);
