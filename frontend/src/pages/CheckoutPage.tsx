import { useState } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { createOrder } from '../api/client';
import { formatCurrency } from '../hooks/useCurrency';
import { useCart } from '../store/CartContext';

export function CheckoutPage() {
  const { items, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [comment, setComment] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await createOrder({ name, phone, address, comment }, items);
      clearCart();
      navigate('/success', { state: response.order });
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : 'Не вдалося оформити замовлення.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  if (!items.length) {
    return <p className="state">Щоб оформити замовлення, спочатку додайте товари в кошик.</p>;
  }

  return (
    <section className="checkout-page">
      <h1>Оформлення замовлення</h1>
      <p className="checkout-total">Сума до сплати: {formatCurrency(totalPrice)}</p>

      <form className="checkout-form" onSubmit={handleSubmit}>
        <label>
          Імʼя
          <input value={name} onChange={event => setName(event.target.value)} required />
        </label>
        <label>
          Телефон
          <input value={phone} onChange={event => setPhone(event.target.value)} required />
        </label>
        <label>
          Адреса доставки
          <input value={address} onChange={event => setAddress(event.target.value)} />
        </label>
        <label>
          Коментар
          <textarea rows={4} value={comment} onChange={event => setComment(event.target.value)} />
        </label>
        {error ? <p className="state error">{error}</p> : null}
        <button type="submit" className="hero-btn" disabled={loading}>
          {loading ? 'Відправлення…' : 'Підтвердити замовлення'}
        </button>
      </form>
    </section>
  );
}
