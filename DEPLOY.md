# Деплой Архитектура Счастья

## Требования

- Node.js 18+
- PM2 (для управления процессами)
- Caddy (для проксирования и SSL)

## Быстрый деплой

```bash
# 1. Перейти в папку проекта на сервере
cd /path/to/happiness

# 2. Настроить переменные окружения
cp .env.example .env.local
nano .env.local  # заполнить реальными данными

# 3. Собрать и запустить
./build.sh
pm2 start ecosystem.config.cjs

# 4. Сохранить PM2 конфигурацию
pm2 save
```

## Переменные окружения (.env.local)

```bash
# Обязательные
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id
NEXT_PUBLIC_TELEGRAM_USERNAME=your-username
NEXT_PUBLIC_CALCOM_LINK=https://cal.com/username/event
NEXT_PUBLIC_SITE_URL=https://ah.aidevteam.ru
```

## Caddy конфигурация

Добавить в Caddyfile:

```caddyfile
ah.aidevteam.ru {
    reverse_proxy localhost:3000
}
```

Перезагрузить Caddy:
```bash
sudo systemctl reload caddy
```

Caddy автоматически получит SSL сертификат от Let's Encrypt.

## Команды PM2

```bash
# Статус
pm2 status

# Логи
pm2 logs architecture-happiness

# Перезапуск
pm2 restart architecture-happiness

# Остановка
pm2 stop architecture-happiness
```

## Обновление

```bash
cd /path/to/happiness
./scripts/deploy.sh
```

## Порт

- **Архитектура Счастья**: 3000
