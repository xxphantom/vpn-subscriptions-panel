# VPN Panel

Панель управления подписками VPN на базе протокола VLESS для клиента [Happ](https://www.happ.su/main/ru). Проект разработан для удобного управления пользователями VPN-сервиса, их подписками и настройками. Система генерирует подписки в формате, совместимом с клиентом Happ, что позволяет пользователям легко импортировать и использовать VPN-конфигурации в приложении.

![Sample](docs/sample.png)

## Технологии

- Node.js
- TypeScript
- Express
- PayloadCMS
- PostgreSQL
- Docker

## Требования

- Docker и Docker Compose
- Необходимо создать собственный сертификат SSL и установить его на хосте

## Пример получения сертификата SSL через ACME.SH для WebNames (c подтверждением по WebHook)

- Для получения сертификата SSL c помощью команд ниже необходимо установить ACME.SH по инструкции Webnames (с вашим API ключом)
- Инструкция есть в личном кабинете WebNames - заходим в карточку домена, далее "Управление зоной" - Изменить и листаем вниз до "Настройка ACME.SH [Let's Encrypt]"

```bash
./acme.sh --issue --dns dns_webnames -d example.com

./acme.sh --install-cert -d example.com --cert-file /root/cert/example.com/cert.pem --key-file /root/cert/example.com/key.pem --fullchain-file /root/cert/example.com/fullchain.pem --reloadcmd "pm2 restart vpn-panel"
```


## О Docker конфигурации

1. `docker-compose.yml` - обеспечивает:
   - Запуск PostgreSQL базы данных
   - Сохранение данных в локальной директории через volume

## Начало работы

1. Клонируйте репозиторий:

```bash
git clone https://github.com/xxphantom/vpn-subscriptions-panel.git
cd vpn-panel
```

2. Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

3. Настройте переменные окружения в файле `.env`:

### Настройки базы данных PostgreSQL:
- `DB_NAME` - имя базы данных (например: vpn)
- `DB_USER` - имя пользователя базы данных (например: vpn)
- `DB_PASSWORD` - пароль для доступа к базе данных (нужно придумать)
- `DB_HOST` - хост базы данных (по умолчанию: 127.0.0.1)
- `DB_PORT` - порт базы данных (по умолчанию: 5432)

### Настройки приложения:
- `PAYLOAD_SECRET` - секретный ключ для PayloadCMS (используйте случайную строку)
- `SUBSCRIPTIONS_DOMAIN_URL` - домен вашего сервера (например: https://example.com)
- `SUBSCRIPTIONS_DOMAIN_PORT` - порт, на котором будет работать приложение (по умолчанию: 3000)
- `NODE_ENV` - режим работы приложения:
  - `development` - для разработки
  - `production` - для production среды (необходим для работы с HTTPS)

### SSL-сертификаты (требуются для режима production):
- `SSL_KEY_PATH` - путь к приватному ключу SSL (например: /root/cert/key.pem)
- `SSL_CERT_PATH` - путь к цепочке сертификатов SSL (например: /root/cert/fullchain.pem) для локального использования

4. Установите зависимости:

```bash
npm run i
```

5. Запустите базу данных через Docker:

```bash
docker-compose up
```

6. Запустите миграцию базы данных (для создания таблиц):

```bash
npm run payload migrate
```

## Запуск в режиме production:

9. Установите pm2:

```bash
npm install -g pm2  # Установите pm2, если его нет
```

10. Запустите приложение в режиме production:

```bash
pm2 start npm --name "vpn-panel" -- run serve # Запустите приложение в режиме production
pm2 save  # Сохраните конфигурацию pm2
pm2 startup # Включите автозагрузку pm2
```

## Доступные команды

- `npm run dev` - запуск сервера разработки с hot-reload
- `npm run build` - полная сборка проекта (включает build:payload, build:server и copyfiles)
- `npm run serve` - запуск production сервера
- `npm run generate:types` - генерация TypeScript типов

## Структура проекта

- `/src` - исходный код приложения
- `/database` - данные PostgreSQL (при использовании Docker)
- `/payload-types.ts` - TypeScript типы Payload
- `/build` - сборка Payload
- `/dist` - скомпилированные файлы

## Благодарности

- [Payload](https://payloadcms.com/) - отличный инструмент для управления контентом
- [Евгений Паромов](https://paromovevg.ru/evolution-community) - крутой наставник, вступайте в Evolution Community

## Лицензия

MIT
