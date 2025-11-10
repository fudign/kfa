/**
 * Автоматизированный тест системы авторизации KFA
 *
 * ИНСТРУКЦИЯ:
 * 1. Запустите backend: cd kfa-backend/kfa-api && php artisan serve
 * 2. Запустите этот тест: node test-auth-system.js
 */

const API_BASE = 'http://localhost:8000/api';

// Утилита для HTTP запросов
async function request(method, endpoint, data = null, token = null) {
  const headers = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const options = {
    method,
    headers,
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(`${API_BASE}${endpoint}`, options);
    const responseData = await response.json();

    return {
      status: response.status,
      ok: response.ok,
      data: responseData,
    };
  } catch (error) {
    return {
      status: 0,
      ok: false,
      error: error.message,
    };
  }
}

// Генератор случайного email
function randomEmail() {
  return `test.${Date.now()}@kfa-test.kg`;
}

// Цвета для консоли
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function logTest(name) {
  console.log(`\n${'='.repeat(60)}`);
  log(`ТЕСТ: ${name}`, 'blue');
  console.log('='.repeat(60));
}

function logSuccess(message) {
  log(`✅ УСПЕХ: ${message}`, 'green');
}

function logFail(message) {
  log(`❌ ОШИБКА: ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ️  INFO: ${message}`, 'yellow');
}

// Тесты
const tests = {
  results: {
    total: 0,
    passed: 0,
    failed: 0,
  },

  // Тест 1: Регистрация со слабым паролем (только буквы)
  async testWeakPasswordLettersOnly() {
    logTest('Регистрация со слабым паролем (только буквы)');
    this.results.total++;

    const data = {
      name: 'Тест Пользователь',
      email: randomEmail(),
      password: 'password',
      password_confirmation: 'password',
    };

    const result = await request('POST', '/register', data);

    if (!result.ok && result.data.errors?.password) {
      logSuccess('Слабый пароль отклонен');
      logInfo(`Ошибка: ${result.data.errors.password[0]}`);
      this.results.passed++;
      return true;
    } else {
      logFail('Слабый пароль был принят!');
      this.results.failed++;
      return false;
    }
  },

  // Тест 2: Регистрация со слабым паролем (только цифры)
  async testWeakPasswordNumbersOnly() {
    logTest('Регистрация со слабым паролем (только цифры)');
    this.results.total++;

    const data = {
      name: 'Тест Пользователь',
      email: randomEmail(),
      password: '12345678',
      password_confirmation: '12345678',
    };

    const result = await request('POST', '/register', data);

    if (!result.ok && result.data.errors?.password) {
      logSuccess('Слабый пароль отклонен');
      logInfo(`Ошибка: ${result.data.errors.password[0]}`);
      this.results.passed++;
      return true;
    } else {
      logFail('Слабый пароль был принят!');
      this.results.failed++;
      return false;
    }
  },

  // Тест 3: Регистрация с коротким паролем
  async testShortPassword() {
    logTest('Регистрация с коротким паролем (<8 символов)');
    this.results.total++;

    const data = {
      name: 'Тест Пользователь',
      email: randomEmail(),
      password: 'pass12',
      password_confirmation: 'pass12',
    };

    const result = await request('POST', '/register', data);

    if (!result.ok && result.data.errors?.password) {
      logSuccess('Короткий пароль отклонен');
      logInfo(`Ошибка: ${result.data.errors.password[0]}`);
      this.results.passed++;
      return true;
    } else {
      logFail('Короткий пароль был принят!');
      this.results.failed++;
      return false;
    }
  },

  // Тест 4: Успешная регистрация с сильным паролем
  async testSuccessfulRegistration() {
    logTest('Успешная регистрация с сильным паролем');
    this.results.total++;

    const email = randomEmail();
    const data = {
      name: 'Тест Пользователь',
      email: email,
      password: 'MyPass2024',
      password_confirmation: 'MyPass2024',
    };

    const result = await request('POST', '/register', data);

    if (result.ok && result.data.token && result.data.user) {
      logSuccess('Регистрация выполнена успешно');
      logInfo(`Email: ${email}`);
      logInfo(`User ID: ${result.data.user.id}`);
      logInfo(`Token: ${result.data.token.substring(0, 20)}...`);
      this.results.passed++;
      return { email, password: 'MyPass2024', token: result.data.token, user: result.data.user };
    } else {
      logFail('Регистрация не удалась');
      logInfo(`Ответ: ${JSON.stringify(result.data, null, 2)}`);
      this.results.failed++;
      return null;
    }
  },

  // Тест 5: Вход с неверными данными
  async testLoginWithWrongCredentials() {
    logTest('Вход с неверными данными');
    this.results.total++;

    const data = {
      email: 'wrong@email.com',
      password: 'wrongpassword123',
    };

    const result = await request('POST', '/login', data);

    if (!result.ok && result.data.errors?.email) {
      logSuccess('Неверные данные отклонены');
      logInfo(`Ошибка: ${result.data.errors.email[0]}`);
      this.results.passed++;
      return true;
    } else {
      logFail('Вход с неверными данными был разрешен!');
      this.results.failed++;
      return false;
    }
  },

  // Тест 6: Успешный вход
  async testSuccessfulLogin(credentials) {
    logTest('Успешный вход в систему');
    this.results.total++;

    if (!credentials) {
      logFail('Нет credentials для тестирования');
      this.results.failed++;
      return null;
    }

    const data = {
      email: credentials.email,
      password: credentials.password,
    };

    const result = await request('POST', '/login', data);

    if (result.ok && result.data.token && result.data.user) {
      logSuccess('Вход выполнен успешно');
      logInfo(`Email: ${credentials.email}`);
      logInfo(`Token: ${result.data.token.substring(0, 20)}...`);
      this.results.passed++;
      return { token: result.data.token, user: result.data.user };
    } else {
      logFail('Вход не удался');
      logInfo(`Ответ: ${JSON.stringify(result.data, null, 2)}`);
      this.results.failed++;
      return null;
    }
  },

  // Тест 7: Получение данных пользователя с токеном
  async testGetUserWithToken(token) {
    logTest('Получение данных пользователя с токеном');
    this.results.total++;

    if (!token) {
      logFail('Нет токена для тестирования');
      this.results.failed++;
      return false;
    }

    const result = await request('GET', '/user', null, token);

    if (result.ok && result.data.data) {
      logSuccess('Данные пользователя получены');
      logInfo(`User: ${result.data.data.name} (${result.data.data.email})`);
      logInfo(`Roles: ${result.data.data.roles?.join(', ') || 'нет'}`);
      this.results.passed++;
      return true;
    } else {
      logFail('Не удалось получить данные пользователя');
      logInfo(`Ответ: ${JSON.stringify(result.data, null, 2)}`);
      this.results.failed++;
      return false;
    }
  },

  // Тест 8: Получение данных без токена
  async testGetUserWithoutToken() {
    logTest('Попытка получить данные без токена');
    this.results.total++;

    const result = await request('GET', '/user', null, null);

    if (!result.ok) {
      logSuccess('Доступ без токена заблокирован');
      logInfo(`Status: ${result.status}`);
      this.results.passed++;
      return true;
    } else {
      logFail('Доступ без токена был разрешен!');
      this.results.failed++;
      return false;
    }
  },

  // Тест 9: Выход из системы
  async testLogout(token) {
    logTest('Выход из системы');
    this.results.total++;

    if (!token) {
      logFail('Нет токена для тестирования');
      this.results.failed++;
      return false;
    }

    const result = await request('POST', '/logout', null, token);

    if (result.ok) {
      logSuccess('Выход выполнен успешно');
      this.results.passed++;
      return true;
    } else {
      logFail('Выход не удался');
      logInfo(`Ответ: ${JSON.stringify(result.data, null, 2)}`);
      this.results.failed++;
      return false;
    }
  },

  // Тест 10: Использование токена после выхода
  async testTokenAfterLogout(token) {
    logTest('Использование токена после выхода');
    this.results.total++;

    if (!token) {
      logFail('Нет токена для тестирования');
      this.results.failed++;
      return false;
    }

    const result = await request('GET', '/user', null, token);

    if (!result.ok) {
      logSuccess('Токен после выхода недействителен');
      logInfo(`Status: ${result.status}`);
      this.results.passed++;
      return true;
    } else {
      logFail('Токен после выхода все еще работает!');
      this.results.failed++;
      return false;
    }
  },

  // Запуск всех тестов
  async runAll() {
    console.log('\n');
    log('╔════════════════════════════════════════════════════════════╗', 'magenta');
    log('║     АВТОМАТИЗИРОВАННОЕ ТЕСТИРОВАНИЕ АВТОРИЗАЦИИ KFA       ║', 'magenta');
    log('╚════════════════════════════════════════════════════════════╝', 'magenta');

    // Проверка доступности API
    logTest('Проверка доступности API');
    try {
      const result = await fetch(`${API_BASE.replace('/api', '')}/up`);
      if (result.ok) {
        logSuccess('Backend доступен');
      } else {
        throw new Error('Backend недоступен');
      }
    } catch (error) {
      logFail('Backend недоступен! Запустите: php artisan serve');
      return;
    }

    // Тесты валидации паролей
    await this.testWeakPasswordLettersOnly();
    await this.testWeakPasswordNumbersOnly();
    await this.testShortPassword();

    // Тест успешной регистрации
    const newUser = await this.testSuccessfulRegistration();

    // Тест входа
    await this.testLoginWithWrongCredentials();
    const loginResult = await this.testSuccessfulLogin(newUser);

    // Тесты токенов
    await this.testGetUserWithoutToken();
    if (loginResult) {
      await this.testGetUserWithToken(loginResult.token);
      await this.testLogout(loginResult.token);
      await this.testTokenAfterLogout(loginResult.token);
    }

    // Итоговый отчет
    this.printReport();
  },

  // Печать отчета
  printReport() {
    console.log('\n');
    log('╔════════════════════════════════════════════════════════════╗', 'magenta');
    log('║                    ИТОГОВЫЙ ОТЧЕТ                         ║', 'magenta');
    log('╚════════════════════════════════════════════════════════════╝', 'magenta');

    console.log('\n');
    log(`Всего тестов: ${this.results.total}`, 'blue');
    log(`✅ Пройдено: ${this.results.passed}`, 'green');
    log(`❌ Провалено: ${this.results.failed}`, 'red');

    const percentage = ((this.results.passed / this.results.total) * 100).toFixed(1);
    console.log('\n');

    if (percentage === '100.0') {
      log(`🎉 УСПЕХ: ${percentage}% тестов пройдено!`, 'green');
      log('Система авторизации работает корректно!', 'green');
    } else if (percentage >= 80) {
      log(`⚠️  ПРЕДУПРЕЖДЕНИЕ: ${percentage}% тестов пройдено`, 'yellow');
      log('Система работает, но есть проблемы', 'yellow');
    } else {
      log(`❌ КРИТИЧНО: ${percentage}% тестов пройдено`, 'red');
      log('Система авторизации требует исправлений!', 'red');
    }

    console.log('\n');
  },
};

// Запуск тестов
tests.runAll().catch((error) => {
  console.error('Критическая ошибка:', error);
  process.exit(1);
});
