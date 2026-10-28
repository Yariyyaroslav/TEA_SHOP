# Теплий лист — React + TypeScript SPA

Інтернет-магазин чаю з фронтендом на **React + TypeScript (Vite)** та бекендом на **Express + MongoDB (Mongoose)**.

## Що реалізовано

- SPA з клієнтською маршрутизацією:
  - `/` — головна
  - `/catalog` — каталог
  - `/product/:slug` — сторінка товару
  - `/cart` — кошик
  - `/checkout` — оформлення замовлення
  - `/success` — успішне замовлення
  - `404` — сторінку не знайдено
- Увесь інтерфейс українською мовою.
- Відображення цін у гривнях (формат `uk-UA`, `UAH`).
- Кошик у `localStorage` (додавання, зміна кількості, видалення).
- Backend API для SPA:
  - `GET /api/teas`
  - `GET /api/teas/:slug`
  - `POST /api/orders`
- Збережено MongoDB/Mongoose та Telegram-сповіщення.
- Старий EJS-інтерфейс виведений з використання (сервер працює як API + SPA static).

## Вимоги

- Node.js 18+
- Доступ до MongoDB

## Налаштування

1. Встановіть залежності бекенду:

```bash
npm install
```

2. Встановіть залежності фронтенду:

```bash
npm --prefix frontend install
```

3. Створіть `.env` на основі `.env.example`:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>/<db>?retryWrites=true&w=majority
PORT=3000
SESSION_SECRET=change-me
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=
```

> Не комітьте секрети та не вставляйте реальні токени/паролі у репозиторій.

4. (Опційно) Заповніть демо-товари:

```bash
npm run seed
```

## Запуск

### Режим розробки (frontend + backend одночасно)

```bash
npm run dev
```

- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000`
- Vite proxy автоматично проксуює `/api` на backend.

### Production build frontend

```bash
npm run build
```

### Запуск backend (і зібраного frontend, якщо є `frontend/dist`)

```bash
npm start
```

## Telegram

Щоб увімкнути повідомлення про замовлення, задайте:

- `TELEGRAM_BOT_TOKEN`
- `TELEGRAM_CHAT_ID`

Якщо значення порожні, замовлення все одно буде збережене в MongoDB.
