import { Link } from 'react-router-dom';
import { formatCurrency } from '../hooks/useCurrency';
import { useCart } from '../store/CartContext';

export function CartPage() {
  const { items, totalPrice, updateQuantity, removeFromCart } = useCart();

  if (!items.length) {
    return (
      <section className="state-wrap">
        <h1>Кошик</h1>
        <p className="state">Ваш кошик порожній. Додайте чай із каталогу.</p>
        <Link to="/catalog" className="hero-btn">
          До каталогу
        </Link>
      </section>
    );
  }

  return (
    <section>
      <h1>Кошик</h1>
      <div className="cart-grid">
        {items.map(item => (
          <article className="cart-item" key={item.teaId}>
            <img src={item.image || '/images/tea-placeholder.svg'} alt={item.name} />
            <div>
              <h3>{item.name}</h3>
              <p>{formatCurrency(item.price)}</p>
              <div className="qty-row">
                <button type="button" onClick={() => updateQuantity(item.teaId, item.quantity - 1)}>
                  −
                </button>
                <span>{item.quantity}</span>
                <button type="button" onClick={() => updateQuantity(item.teaId, item.quantity + 1)}>
                  +
                </button>
              </div>
            </div>
            <button type="button" className="link-btn" onClick={() => removeFromCart(item.teaId)}>
              Видалити
            </button>
          </article>
        ))}
      </div>

      <div className="checkout-bar">
        <p>
          Разом: <strong>{formatCurrency(totalPrice)}</strong>
        </p>
        <Link to="/checkout" className="hero-btn">
          Оформити замовлення
        </Link>
      </div>
    </section>
  );
}
