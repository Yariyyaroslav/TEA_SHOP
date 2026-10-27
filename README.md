# Тёплый лист

MVC-магазин чая на Node.js/Express с серверным EJS-интерфейсом, MongoDB через Mongoose и уведомлениями о заказах в Telegram.

## Запуск

1. Установите Node.js 18+ и MongoDB.
2. Выполните `npm install`.
3. Скопируйте `.env.example` в `.env` и заполните `MONGODB_URI`.
4. Для Telegram укажите `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID`. Если их не указать, заказ всё равно сохранится в MongoDB.
5. Загрузите демонстрационные товары: `npm run seed`.
6. Запустите сайт: `npm start` или `npm run dev`.

Сайт будет доступен на `http://localhost:3000`.

## Telegram

Создайте бота через BotFather, отправьте ему сообщение, затем получите chat id и внесите значения только в `.env`. Секреты не нужно коммитить в репозиторий.

## Структура

- `src/models` — Mongoose-модели товаров и заказов;
- `src/controllers` — MVC-контроллеры;
- `src/routes` — маршруты Express;
- `src/views` — EJS-шаблоны;
- `src/services/telegram.js` — интеграция с Telegram Bot API.
