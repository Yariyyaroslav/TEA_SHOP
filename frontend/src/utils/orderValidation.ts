import type { CustomerData } from '../types';

export const NAME_MIN_LENGTH = 2;
export const NAME_MAX_LENGTH = 100;
export const ADDRESS_MIN_LENGTH = 5;
export const ADDRESS_MAX_LENGTH = 250;
export const COMMENT_MAX_LENGTH = 500;

export type CheckoutFieldErrors = {
  name?: string;
  phone?: string;
  address?: string;
  comment?: string;
  items?: string;
};

export function normalizePhone(phone: string): string {
  const rawValue = phone.trim();
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

function isValidPhone(phone: string): boolean {
  return /^\+[1-9]\d{9,14}$/.test(phone);
}

export function validateCheckoutCustomer(customer: CustomerData): {
  value: CustomerData;
  errors: CheckoutFieldErrors;
} {
  const value: CustomerData = {
    name: customer.name.trim(),
    phone: normalizePhone(customer.phone),
    address: customer.address.trim(),
    comment: customer.comment.trim()
  };
  const errors: CheckoutFieldErrors = {};

  if (!value.name) {
    errors.name = 'Вкажіть імʼя клієнта.';
  } else if (value.name.length < NAME_MIN_LENGTH) {
    errors.name = `Імʼя має містити щонайменше ${NAME_MIN_LENGTH} символи.`;
  } else if (value.name.length > NAME_MAX_LENGTH) {
    errors.name = `Імʼя має містити не більше ${NAME_MAX_LENGTH} символів.`;
  }

  if (!value.phone) {
    errors.phone = 'Вкажіть номер телефону.';
  } else if (!isValidPhone(value.phone)) {
    errors.phone = 'Вкажіть коректний номер телефону, наприклад +380XXXXXXXXX.';
  }

  if (!value.address) {
    errors.address = 'Вкажіть адресу доставки.';
  } else if (value.address.length < ADDRESS_MIN_LENGTH) {
    errors.address = `Адреса має містити щонайменше ${ADDRESS_MIN_LENGTH} символів.`;
  } else if (value.address.length > ADDRESS_MAX_LENGTH) {
    errors.address = `Адреса має містити не більше ${ADDRESS_MAX_LENGTH} символів.`;
  }

  if (value.comment.length > COMMENT_MAX_LENGTH) {
    errors.comment = `Коментар має містити не більше ${COMMENT_MAX_LENGTH} символів.`;
  }

  return { value, errors };
}
