async function sendOrderToTelegram(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    console.warn('Telegram is not configured; order saved without notification.');
    return;
  }
  const lines = order.items.map(item => `• ${item.name} — ${item.quantity} × ${item.price} ₽`).join('\n');
  const text = [
    `🫖 Новый заказ #${order._id}`,
    '', lines, '',
    `Итого: ${order.total} ₽`,
    `Имя: ${order.customer.name}`,
    `Телефон: ${order.customer.phone}`,
    `Адрес: ${order.customer.address || 'не указан'}`,
    `Комментарий: ${order.customer.comment || 'нет'}`
  ].join('\n');
  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });
  if (!response.ok) throw new Error(`Telegram API error: ${response.status}`);
}

module.exports = { sendOrderToTelegram };
