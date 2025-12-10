# Деплой Архитектура Счастья

## Требования

- Node.js 18+
- PM2 (для управления процессами)
- Nginx (для проксирования)

## Быстрый деплой

```bash
# 1. Клонировать репозиторий (если еще не склонирован)
git clone https://github.com/maslennikov-ig/happiness.git /home/me/code/happiness
cd /home/me/code/happiness

# 2. Настроить переменные окружения
cp .env.example .env.local
# Отредактировать .env.local с реальными данными

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

## Nginx конфигурация

Создать файл `/etc/nginx/sites-available/ah.aidevteam.ru`:

```nginx
server {
    listen 80;
    server_name ah.aidevteam.ru;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name ah.aidevteam.ru;

    ssl_certificate /etc/letsencrypt/live/ah.aidevteam.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/ah.aidevteam.ru/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Активировать:
```bash
sudo ln -s /etc/nginx/sites-available/ah.aidevteam.ru /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx
```

## SSL сертификат (Let's Encrypt)

```bash
sudo certbot --nginx -d ah.aidevteam.ru
```

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
cd /home/me/code/happiness
./scripts/deploy.sh
```

## Порты

- **Zalogium**: 3000
- **Архитектура Счастья**: 3001
