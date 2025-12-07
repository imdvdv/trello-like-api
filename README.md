# Trello-like API

RESTful API для управления задачами в стиле Trello, построенное на NestJS.

## Возможности

- Регистрация и авторизация (JWT)
- Управление колонками
- Управление карточками
- Комментарии к карточкам
- Swagger документация
- Docker контейнеризация

## Технологии

- **NestJS** v18+
- **TypeScript**
- **PostgreSQL** v16+
- **TypeORM**
- **JWT**
- **Swagger**
- **Docker**

---

### Запуск

## 1. С помощью Docker

### 1.1 Настройте переменные окружения:
   
   Создайте файл `.env`, скопируйте в него содержимое файла `.example.env` и подставьте свои значения.

### 1.2 Запустите приложение:

```bash
docker-compose up -d --build
```

## 2. Локальная установка (без Docker)

## 2.1 Установите зависимости:

   ```bash
   npm install
   ```

## 2.2 Создайте базу данных:

   ```sql
   CREATE DATABASE trello_like_api;
   ```

## 2.3 Настройте переменные окружения:
   
   Создайте файл `.env`, скопируйте в него содержимое файла `.example.env` и подставьте свои значения.

## 2.4 Запустите приложение:
   ```bash

   npm run start:dev
   
   ```

---

## Схема базы данных

**Интерактивная диаграмма:** [dbdiagram.io](https://dbdiagram.io/d/69300636d6676488ba64d50d)

## API Документация

После запуска приложения откройте Swagger UI:

**http://localhost:3000/api/docs**


### Эндпоинты API

#### Авторизация (`/auth`)

`POST`: `/auth/register` - Регистрация нового пользователя
`POST`: `/auth/login` - Авторизация пользователя
`POST`: `/auth/logout` - Выход из системы (авторизованный)

#### Пользователи (`/users`)

`GET`: `/users` - Получение всех пользователей (авторизованный)
`GET`: `/users/:userId` - Получение пользователя по ID (авторизованный)
`PATCH`: `/users/:userId` - Обновление пользователя (авторизованный, владелец)
`DELETE`: `/users/:userId` - Удаление пользователя (авторизованный, владелец)

#### Колонки (`/users/:userId/columns`)

`POST`: `/users/:userId/columns` - Создание новой колонки (авторизованный, владелец)
`GET`: `/users/:userId/columns` - Получение всех колонок пользователя (авторизованный)
`GET`: `/users/:userId/columns/:columnId` - Получение колонки по ID (авторизованный)
`PATCH`: `/users/:userId/columns/:columnId` - Обновление колонки (авторизованный, владелец)
`DELETE`: `/users/:userId/columns/:columnId` - Удаление колонки (авторизованный, владелец)

#### Карточки (`/columns/:columnId/cards`)

`POST`: `/columns/:columnId/cards` - Создание новой карточки в колонке (авторизованный)
`GET`: `/columns/:columnId/cards` - Получение всех карточек колонки (авторизованный)
`GET`: `/columns/:columnId/cards/:cardId` - Получение карточки по ID (авторизованный)
`PATCH`: `/columns/:columnId/cards/:cardId` - Обновление карточки (авторизованный, владелец)
`DELETE`: `/columns/:columnId/cards/:cardId` - Удаление карточки (авторизованный, владелец)

#### Комментарии (`/cards/:cardId/comments`)

`POST`:  `/cards/:cardId/comments` - Создание комментария к карточке (авторизованный)
`GET`:  `/cards/:cardId/comments` - Получение всех комментариев карточки (авторизованный)
`GET`:  `/cards/:cardId/comments/:commentId` - Получение комментария по ID (авторизованный)
`PATCH`:  `/cards/:cardId/comments/:commentId` - Обновление комментария (авторизованный, владелец)
`DELETE`:  `/cards/:cardId/comments/:commentId` - Удаление комментария (авторизованный, владелец)

---

## Лицензия

[MIT licensed](LICENSE)


