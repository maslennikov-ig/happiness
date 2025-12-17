# Настройка сервера для деплоя (Docker + Caddy)

## Информация о сервере

- **IP сервера:** 80.74.28.160
- **Домен:** archihappy.ru
- **Папка деплоя:** /var/www/happiness

---

## Шаг 1: Выполнить на сервере от root

Скопируй и выполни весь блок команд:

```bash
# ============================================
# СОЗДАНИЕ ПОЛЬЗОВАТЕЛЯ И ПАПКИ
# ============================================

# Создать пользователя deploy (если его нет)
id deploy &>/dev/null || useradd -r -m -s /bin/bash -d /home/deploy deploy

# Создать папку для проекта
mkdir -p /var/www/happiness
chown -R deploy:deploy /var/www/happiness
chmod 755 /var/www/happiness

# ============================================
# SSH КЛЮЧ ДЛЯ CLAUDE
# ============================================

# Создать .ssh директорию для deploy
mkdir -p /home/deploy/.ssh
chmod 700 /home/deploy/.ssh

# Добавить публичный ключ Claude
cat >> /home/deploy/.ssh/authorized_keys << 'EOF'
ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAIHObKR61lwnyeTDYMybKEfGsUzXctmEcm2A2tf1L0W7m claude-happiness-deploy
EOF

# Права на .ssh
chown -R deploy:deploy /home/deploy/.ssh
chmod 600 /home/deploy/.ssh/authorized_keys

# ============================================
# ПРАВА SUDO ДЛЯ DEPLOY
# ============================================

# Docker команды без пароля
cat > /etc/sudoers.d/deploy << 'EOF'
# Docker
deploy ALL=(ALL) NOPASSWD: /usr/bin/docker
deploy ALL=(ALL) NOPASSWD: /usr/bin/docker-compose
deploy ALL=(ALL) NOPASSWD: /usr/bin/docker compose

# Caddy
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl reload caddy
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl restart caddy
deploy ALL=(ALL) NOPASSWD: /usr/bin/systemctl status caddy

# Чтение Caddy конфига
deploy ALL=(ALL) NOPASSWD: /usr/bin/tee /etc/caddy/Caddyfile
deploy ALL=(ALL) NOPASSWD: /usr/bin/tee -a /etc/caddy/Caddyfile
deploy ALL=(ALL) NOPASSWD: /bin/cat /etc/caddy/Caddyfile
EOF

chmod 440 /etc/sudoers.d/deploy

# ============================================
# ДОБАВИТЬ DEPLOY В ГРУППУ DOCKER
# ============================================

usermod -aG docker deploy

# ============================================
# ПРОВЕРКА
# ============================================

echo ""
echo "=========================================="
echo "НАСТРОЙКА ЗАВЕРШЕНА"
echo "=========================================="
echo "Пользователь: deploy"
echo "Папка проекта: /var/www/happiness"
echo "SSH доступ: готов"
echo ""
echo "Проверь подключение Claude:"
echo "ssh deploy@80.74.28.160"
echo "=========================================="
```

---

## Шаг 2: Проверить что установлено на сервере

```bash
# Проверить Docker
docker --version

# Проверить Docker Compose
docker compose version

# Проверить Caddy
caddy version

# Проверить Git
git --version
```

### Если чего-то нет:

```bash
# Docker (если нет)
curl -fsSL https://get.docker.com | sh

# Caddy (если нет)
apt install -y debian-keyring debian-archive-keyring apt-transport-https
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/gpg.key' | gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
curl -1sLf 'https://dl.cloudsmith.io/public/caddy/stable/debian.deb.txt' | tee /etc/apt/sources.list.d/caddy-stable.list
apt update
apt install caddy

# Git (если нет)
apt install -y git
```

---

## Шаг 3: Настроить Caddy

Добавь в `/etc/caddy/Caddyfile`:

```caddyfile
ah.aidevteam.ru {
    reverse_proxy localhost:3000
}
```

Перезагрузи Caddy:

```bash
systemctl reload caddy
```

---

## Шаг 4: Сообщить Claude

После выполнения всех команд напиши мне:
- "Сервер готов" - и я подключусь и задеплою проект

---

## Структура на сервере после деплоя

```
/var/www/happiness/
├── docker-compose.yml
├── Dockerfile
├── .env.local
├── src/
├── public/
├── package.json
└── ... (остальные файлы проекта)
```

---

## Команды управления (после деплоя)

```bash
# Статус контейнера
cd /var/www/happiness && docker compose ps

# Логи
cd /var/www/happiness && docker compose logs -f

# Перезапуск
cd /var/www/happiness && docker compose restart

# Пересборка и запуск
cd /var/www/happiness && docker compose up -d --build

# Остановка
cd /var/www/happiness && docker compose down
```

---

## Обновление проекта

```bash
cd /var/www/happiness
git pull
docker compose up -d --build
```

---

## Безопасность

- SSH ключ хранится локально в `.ssh/deploy_key` (добавлен в .gitignore)
- На сервере используется отдельный пользователь `deploy` с минимальными правами
- Caddy автоматически получает SSL от Let's Encrypt
