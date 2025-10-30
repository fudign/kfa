#!/usr/bin/env node

const { execSync } = require('child_process');

function killPort(port) {
  try {
    console.log(`Проверка порта ${port}...`);

    if (process.platform === 'win32') {
      // Windows
      try {
        const result = execSync(`netstat -ano | findstr :${port}`, { encoding: 'utf-8' });
        const lines = result.split('\n').filter(line => line.includes('LISTENING'));

        if (lines.length > 0) {
          console.log(`Порт ${port} занят. Освобождаю...`);
          lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            const pid = parts[parts.length - 1];
            if (pid && !isNaN(pid)) {
              try {
                execSync(`taskkill /PID ${pid} /F`, { stdio: 'ignore' });
                console.log(`Процесс ${pid} завершен`);
              } catch (e) {
                // Игнорируем ошибки
              }
            }
          });
          console.log(`Порт ${port} освобожден`);
        } else {
          console.log(`Порт ${port} свободен`);
        }
      } catch (error) {
        // Порт свободен
        console.log(`Порт ${port} свободен`);
      }
    } else {
      // Linux/Mac
      try {
        const result = execSync(`lsof -ti:${port}`, { encoding: 'utf-8' });
        const pids = result.trim().split('\n').filter(Boolean);

        if (pids.length > 0) {
          console.log(`Порт ${port} занят. Освобождаю...`);
          pids.forEach(pid => {
            try {
              execSync(`kill -9 ${pid}`, { stdio: 'ignore' });
              console.log(`Процесс ${pid} завершен`);
            } catch (e) {
              // Игнорируем ошибки
            }
          });
          console.log(`Порт ${port} освобожден`);
        } else {
          console.log(`Порт ${port} свободен`);
        }
      } catch (error) {
        // Порт свободен
        console.log(`Порт ${port} свободен`);
      }
    }
  } catch (error) {
    console.log(`Порт ${port} свободен`);
  }
}

// Освобождаем порты 3000 и 3001
const ports = process.argv.slice(2).map(Number);
if (ports.length === 0) {
  // По умолчанию освобождаем порт 3000
  killPort(3000);
} else {
  ports.forEach(port => killPort(port));
}
