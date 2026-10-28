import { Link, useLocation } from 'react-router-dom';
import { formatCurrency } from '../hooks/useCurrency';

type SuccessState = {
  id: string;
  total: number;
  createdAt: string;
};

export function SuccessPage() {
  const location = useLocation();
  const order = location.state as SuccessState | null;

  return (
    <section className="state-wrap success">
      <h1>Дякуємо за замовлення!</h1>
      {order ? (
        <>
          <p>Номер замовлення: <strong>{order.id}</strong></p>
          <p>Сума: <strong>{formatCurrency(order.total)}</strong></p>
        </>
      ) : (
        <p>Ваше замовлення прийнято. Менеджер звʼяжеться з вами найближчим часом.</p>
      )}
      <Link className="hero-btn" to="/catalog">
        Продовжити покупки
      </Link>
    </section>
  );
}
