async function sendOrderToTelegram(order) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;

  if (!token || !chatId) {
    console.warn('Telegram не налаштовано; замовлення збережено без сповіщення.');
    return;
  }

  const lines = order.items
    .map(item => `• ${item.name} — ${item.quantity} × ${item.price} грн = ${item.lineTotal} грн`)
    .join('\n');

  const text = [
    `🫖 Нове замовлення #${order.orderNumber}`,
    '',
    lines,
    '',
    `Сума: ${order.subtotal} грн`,
    `Разом: ${order.total} ${order.currency === 'UAH' ? 'грн' : order.currency}`,
    `Імʼя: ${order.customer.name}`,
    `Телефон: ${order.customer.phone}`,
    `Адреса: ${order.customer.address}`,
    `Коментар: ${order.customer.comment || 'немає'}`
  ].join('\n');

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text })
  });

  if (!response.ok) {
    throw new Error(`Telegram API error: ${response.status}`);
  }
}

module.exports = { sendOrderToTelegram };
