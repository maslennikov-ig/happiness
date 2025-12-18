# GitHub Secrets для CI/CD

Для работы автоматического деплоя нужно добавить секреты в GitHub репозиторий.

## Как добавить секреты

1. Открой репозиторий на GitHub: https://github.com/maslennikov-ig/happiness
2. Settings -> Secrets and variables -> Actions
3. New repository secret

## Необходимые секреты

| Секрет | Описание | Значение |
|--------|----------|----------|
| `SSH_PRIVATE_KEY` | Приватный SSH ключ для подключения к серверу | Содержимое файла `.ssh/deploy_key` |
| `SERVER_HOST` | IP адрес сервера | `80.74.28.160` |
| `SERVER_USER` | Пользователь для SSH подключения | `deploy` |
| `SITE_DOMAIN` | Домен сайта для проверки деплоя | `archihappy.ru` |

## Подробная инструкция по каждому секрету

### SSH_PRIVATE_KEY

Этот секрет содержит приватный SSH ключ для подключения к серверу.

**Как получить:**

```bash
# Локально на машине разработчика
cat /home/me/code/happiness/.ssh/deploy_key
```

**Формат значения:**

```
-----BEGIN OPENSSH PRIVATE KEY-----
... содержимое ключа ...
-----END OPENSSH PRIVATE KEY-----
```

**ВАЖНО:**
- Скопируй **ВСЁ содержимое**, включая строки `-----BEGIN...` и `-----END...`
- Убедись что на сервере публичный ключ добавлен в `~/.ssh/authorized_keys` пользователя `deploy`
- Никогда не коммить приватный ключ в репозиторий

### SERVER_HOST

IP адрес или hostname сервера.

**Значение:** `80.74.28.160`

### SERVER_USER

Имя пользователя для SSH подключения.

**Значение:** `deploy`

**Требования к пользователю на сервере:**
- Доступ к директории `/var/www/happiness`
- Права на выполнение `git`, `docker`, `docker compose`
- Членство в группе `docker`

### SITE_DOMAIN

Домен сайта для проверки успешности деплоя.

**Значение:** `archihappy.ru`

## Настройка Environment (опционально)

Для дополнительной защиты рекомендуется настроить Environment:

1. Settings -> Environments
2. New environment: `production`
3. Добавить protection rules:
   - Required reviewers (опционально)
   - Wait timer (опционально)
4. Environment secrets (если нужны отдельные секреты для production)

## Workflows

### Deploy to Production (`deploy.yml`)

Запускается автоматически при push в `main`.

**Этапы:**
1. **Preflight** - проверка кода (lint, type-check, build)
2. **Deploy** - деплой на сервер через SSH
3. **Verify** - проверка что сайт отвечает

**Ручной запуск:**
- Actions -> Deploy to Production -> Run workflow

### CI (`ci.yml`)

Запускается на PR и push в `develop`.

**Проверки:**
- Lint (ESLint)
- Type check (TypeScript)
- Build (Next.js)
- Docker build (проверка сборки образа)

## Проверка настройки

### 1. Проверить что секреты добавлены

Actions -> Security -> Secrets and variables

Должны быть:
- `SSH_PRIVATE_KEY`
- `SERVER_HOST`
- `SERVER_USER`
- `SITE_DOMAIN`

### 2. Тестовый запуск

1. Actions -> Deploy to Production
2. Run workflow -> Run workflow
3. Проверить логи выполнения

### 3. Проверка на сервере

```bash
# SSH на сервер
ssh deploy@80.74.28.160

# Проверить статус контейнера
cd /var/www/happiness
docker compose ps

# Проверить логи
docker compose logs --tail=50
```

## Troubleshooting

### Ошибка "Permission denied (publickey)"

1. Убедись что публичный ключ добавлен на сервер:
   ```bash
   ssh deploy@80.74.28.160 "cat ~/.ssh/authorized_keys"
   ```

2. Проверь что приватный ключ скопирован полностью в секрет

### Ошибка "Container unhealthy"

1. Проверь логи контейнера на сервере:
   ```bash
   docker compose logs happiness
   ```

2. Проверь что .env файл существует и содержит необходимые переменные

### Ошибка сборки Docker

1. Проверь что Dockerfile корректный
2. Проверь наличие места на диске сервера:
   ```bash
   df -h
   ```

3. Очисти старые образы:
   ```bash
   docker system prune -a
   ```

## Настройка .env на сервере

На сервере в директории `/var/www/happiness` должен быть файл `.env`:

```bash
# Telegram Bot
TELEGRAM_BOT_TOKEN=your-bot-token
TELEGRAM_CHAT_ID=your-chat-id

# Public variables (используются при сборке Docker образа)
NEXT_PUBLIC_TELEGRAM_USERNAME=your-username
NEXT_PUBLIC_CALCOM_LINK=https://cal.com/your-link
NEXT_PUBLIC_SITE_URL=https://archihappy.ru
```

**ВАЖНО:** Файл `.env` должен существовать на сервере ДО запуска деплоя.
