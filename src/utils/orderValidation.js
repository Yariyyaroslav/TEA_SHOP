const NAME_MIN_LENGTH = 2;
const NAME_MAX_LENGTH = 100;
const ADDRESS_MIN_LENGTH = 5;
const ADDRESS_MAX_LENGTH = 250;
const COMMENT_MAX_LENGTH = 500;
const MIN_ITEM_QUANTITY = 1;
const MAX_ITEM_QUANTITY = 99;

function normalizePhone(phone) {
  const rawValue = String(phone ?? '').trim();
  if (!rawValue) {
    return '';
  }

  let normalized = rawValue.replace(/[\s\-()]/g, '');
  if (normalized.startsWith('00')) {
    normalized = `+${normalized.slice(2)}`;
  }

  if (normalized.startsWith('380')) {
    normalized = `+${normalized}`;
  } else if (normalized.startsWith('0') && normalized.length === 10) {
    normalized = `+38${normalized}`;
  } else if (!normalized.startsWith('+') && /^\d{10,15}$/.test(normalized)) {
    normalized = `+${normalized}`;
  }

  return normalized;
}

function isValidPhone(phone) {
  return /^\+[1-9]\d{9,14}$/.test(phone);
}

function validateCustomer(customer) {
  const errors = {};
  const name = String(customer?.name ?? '').trim();
  const address = String(customer?.address ?? '').trim();
  const comment = String(customer?.comment ?? '').trim();
  const phone = normalizePhone(customer?.phone);

  if (!name) {
    errors.name = 'Вкажіть імʼя клієнта.';
  } else if (name.length < NAME_MIN_LENGTH) {
    errors.name = `Імʼя має містити щонайменше ${NAME_MIN_LENGTH} символи.`;
  } else if (name.length > NAME_MAX_LENGTH) {
    errors.name = `Імʼя має містити не більше ${NAME_MAX_LENGTH} символів.`;
  }

  if (!phone) {
    errors.phone = 'Вкажіть номер телефону.';
  } else if (!isValidPhone(phone)) {
    errors.phone = 'Вкажіть коректний номер телефону у міжнародному форматі, наприклад +380XXXXXXXXX.';
  }

  if (!address) {
    errors.address = 'Вкажіть адресу доставки.';
  } else if (address.length < ADDRESS_MIN_LENGTH) {
    errors.address = `Адреса має містити щонайменше ${ADDRESS_MIN_LENGTH} символів.`;
  } else if (address.length > ADDRESS_MAX_LENGTH) {
    errors.address = `Адреса має містити не більше ${ADDRESS_MAX_LENGTH} символів.`;
  }

  if (comment.length > COMMENT_MAX_LENGTH) {
    errors.comment = `Коментар має містити не більше ${COMMENT_MAX_LENGTH} символів.`;
  }

  return {
    value: {
      name,
      phone,
      address,
      comment
    },
    errors
  };
}

function validateOrderItems(items) {
  if (!Array.isArray(items)) {
    return {
      items: [],
      errors: { items: 'Список товарів має бути масивом.' }
    };
  }

  if (!items.length) {
    return {
      items: [],
      errors: { items: 'Кошик порожній. Додайте товари перед оформленням.' }
    };
  }

  const errors = {};
  const normalizedItems = items.map((item, index) => {
    const teaId = String(item?.teaId ?? '').trim();
    const quantity = Number(item?.quantity);
    const hasIntegerQuantity = Number.isInteger(quantity);

    if (!teaId) {
      errors.items = `Товар у позиції ${index + 1} має некоректний ідентифікатор.`;
    }

    if (!hasIntegerQuantity || quantity < MIN_ITEM_QUANTITY || quantity > MAX_ITEM_QUANTITY) {
      errors.items = `Кількість товару має бути цілим числом від ${MIN_ITEM_QUANTITY} до ${MAX_ITEM_QUANTITY}.`;
    }

    return {
      teaId,
      quantity
    };
  });

  return { items: normalizedItems, errors };
}

function buildOrderItems(normalizedItems, teaMap) {
  return normalizedItems.map(item => {
    const tea = teaMap.get(item.teaId);
    const price = Number(tea.price);
    const lineTotal = price * item.quantity;

    return {
      tea: tea._id,
      name: tea.name,
      price,
      quantity: item.quantity,
      lineTotal
    };
  });
}

function calculateTotals(orderItems) {
  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const total = subtotal;

  return { subtotal, total };
}

module.exports = {
  NAME_MIN_LENGTH,
  NAME_MAX_LENGTH,
  ADDRESS_MIN_LENGTH,
  ADDRESS_MAX_LENGTH,
  COMMENT_MAX_LENGTH,
  MIN_ITEM_QUANTITY,
  MAX_ITEM_QUANTITY,
  normalizePhone,
  isValidPhone,
  validateCustomer,
  validateOrderItems,
  buildOrderItems,
  calculateTotals
};
