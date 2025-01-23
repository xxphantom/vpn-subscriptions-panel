# VPN Panel

Панель управления подписками VPN на базе протокола VLESS для клиента [Happ](https://www.happ.su/main/ru). Проект разработан для удобного управления пользователями VPN-сервиса, их подписками и настройками. Система генерирует подписки в формате, совместимом с клиентом Happ, что позволяет пользователям легко импортировать и использовать VPN-конфигурации в приложении.

## Технологии

- Node.js
- TypeScript
- Express
- PayloadCMS
- PostgreSQL
- Docker

## Требования

- Docker
- Docker Compose

## О Docker конфигурации

Проект использует многоэтапную сборку Docker для оптимизации размера конечного образа и безопасности:

1. `docker-compose.yml` - обеспечивает:
   - Запуск PostgreSQL базы данных
   - Сохранение данных в локальной директории через volume
   - Управление переменными окружения

## Начало работы

1. Клонируйте репозиторий:

```bash
git clone <repository-url>
cd vpn-panel
```

2. Создайте файл `.env` на основе `.env.example`:

```bash
cp .env.example .env
```

3. Настройте переменные окружения в файле `.env`

4. Установите зависимости:

```bash
npm run i
```

5. Запустите базу данных через Docker:

```bash
docker-compose up
```

6. Запустите генерацию TypeScript типов:

- `npm run generate:types` - генерация TypeScript типов

7. Запустите приложение в режиме разработки:

```bash
npm run dev # Обязательно хотя бы один раз запустите приложение в режиме разработки, чтобы создать базу данных
```

Для запуска в режиме production:

8. Запустите сборку проекта:

```bash
npm run build   # Сборка проекта
```

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
